import apiClient from './apiClient';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login(email, password) {
    const data = await apiClient.post('/auth/login', { email, password });
    if (data?.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      if (data?.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
      }
      if (data?.user) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
      }
    }
    return data;
  },

  async getCurrentUser() {
    const user = await apiClient.get('/auth/me');
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    }
    return user;
  },

  async refreshToken(refreshToken) {
    return await apiClient.performTokenRefresh(refreshToken);
  },

  async logout() {
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      if (storedRefreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: storedRefreshToken });
      }
    } catch {
      // Ignore network / invalid session errors during logout cleanup
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE);
    }
  },

  async requestPasswordReset(email) {
    return await apiClient.post('/auth/forgot-password', { email });
  },
};

export default authService;
