import apiClient from './apiClient';

export const analyticsService = {
  async getOverviewStats() {
    return await apiClient.get('/analytics/overview');
  },

  async getClubStats(clubId) {
    return await apiClient.get(`/analytics/clubs/${clubId}`);
  },

  async getStudentStats(studentId) {
    return await apiClient.get(`/analytics/students/${studentId}`);
  },

  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient.get(`/analytics/audit-logs${query ? `?${query}` : ''}`);
  },
};

export default analyticsService;
