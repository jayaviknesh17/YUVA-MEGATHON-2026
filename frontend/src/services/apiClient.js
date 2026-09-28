/**
 * Centralized API Client for YUVA Megathon 2026
 * Handles JWT Access + Refresh lifecycle, automatic token rotation,
 * concurrent refresh queuing, and error normalization.
 */

import { STORAGE_KEYS } from '../utils/constants';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

let isRefreshing = false;
let refreshPromise = null;

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async performTokenRefresh(refreshToken) {
    const refreshUrl = `${this.baseURL}/auth/refresh`;
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Token refresh failed' };
      }
      const err = new Error(errorData.detail || errorData.message || 'Session expired. Please log in again.');
      err.status = response.status;
      err.data = errorData;
      throw err;
    }

    const data = await response.json();
    if (data?.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      if (data?.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
      }
      window.dispatchEvent(new CustomEvent('yuva:token_refreshed', { detail: data }));
    }
    return data;
  }

  clearAuthAndRedirect() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE);
    window.dispatchEvent(new CustomEvent('yuva:session_expired'));
  }

  async request(endpoint, options = {}) {
    const isAuthEndpoint =
      endpoint.includes('/auth/login') ||
      endpoint.includes('/auth/refresh') ||
      endpoint.includes('/auth/logout');

    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const config = {
      ...options,
      headers: this.getHeaders(options.headers),
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized (Expired Access Token)
      if (response.status === 401 && !options._retry && !isAuthEndpoint) {
        options._retry = true;

        const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!storedRefreshToken) {
          this.clearAuthAndRedirect();
          const err = new Error('Authentication required.');
          err.status = 401;
          throw err;
        }

        // Handle concurrent refresh calls safely (prevent duplicate rotations)
        if (!refreshPromise) {
          refreshPromise = this.performTokenRefresh(storedRefreshToken)
            .finally(() => {
              refreshPromise = null;
            });
        }

        try {
          await refreshPromise;
          // Retry original request with updated access token
          config.headers = this.getHeaders(options.headers);
          return this.request(endpoint, { ...options, _retry: true });
        } catch (refreshErr) {
          this.clearAuthAndRedirect();
          throw refreshErr;
        }
      }

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText || 'An unexpected error occurred' };
        }
        
        const error = new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (err) {
      if (!err.status && !err.message.includes('fetch')) {
        err.message = err.message || 'Unable to connect to backend server. Please verify API service status.';
      }
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
