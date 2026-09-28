import apiClient from './apiClient';

export const notificationService = {
  async getNotifications() {
    return await apiClient.get('/notifications');
  },

  async markAsRead(id) {
    return await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return await apiClient.post('/notifications/mark-all-read');
  },
};

export default notificationService;
