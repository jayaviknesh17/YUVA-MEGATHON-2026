import apiClient from './apiClient';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login(email, password) {
    const data = await apiClient.post('/auth/login', { email, password });
    if (data?.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser() {
    return await apiClient.get('/auth/me');
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE);
  },

  async requestPasswordReset(email) {
    return await apiClient.post('/auth/forgot-password', { email });
  },
};

export default authService;
