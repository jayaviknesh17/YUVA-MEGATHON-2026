import apiClient from './apiClient';

export const odService = {
  async getMyODRequests() {
    return await apiClient.get('/od/my-requests');
  },

  async applyForOD({ event_id, registration_id, reason }) {
    return await apiClient.post('/od/apply', {
      event_id,
      registration_id,
      reason,
    });
  },

  async getPendingMentorODRequests() {
    return await apiClient.get('/od/mentor/pending-reviews');
  },

  async reviewODRequest(id, { action, remarks = '' }) {
    return await apiClient.post(`/od/${id}/review`, {
      action, // 'APPROVE' or 'REJECT'
      mentor_remarks: remarks,
    });
  },

  async calculateAffectedPeriods(eventId) {
    return await apiClient.get(`/od/calculate-periods/${eventId}`);
  },
};

export default odService;
