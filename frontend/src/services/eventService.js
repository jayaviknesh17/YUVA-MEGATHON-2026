import apiClient from './apiClient';

export const eventService = {
  async getEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient.get(`/events${query ? `?${query}` : ''}`);
  },

  async getEventById(id) {
    return await apiClient.get(`/events/${id}`);
  },

  async createDraftEvent(eventData) {
    return await apiClient.post('/events', eventData);
  },

  async updateEvent(id, eventData) {
    return await apiClient.put(`/events/${id}`, eventData);
  },

  async submitForApproval(id) {
    return await apiClient.post(`/events/${id}/submit`);
  },

  async reviewEvent(id, { action, rejection_reason = '' }) {
    return await apiClient.post(`/events/${id}/review`, {
      action, // 'APPROVE' or 'REJECT'
      rejection_reason,
    });
  },

  async registerForEvent(id) {
    return await apiClient.post(`/events/${id}/register`);
  },

  async cancelRegistration(id) {
    return await apiClient.post(`/events/${id}/cancel-registration`);
  },

  async recordAttendance(eventId, studentId, data = {}) {
    return await apiClient.post(`/events/${eventId}/attendance`, {
      student_id: studentId,
      ...data,
    });
  },

  async getEventAttendees(eventId) {
    return await apiClient.get(`/events/${eventId}/attendees`);
  },
};

export default eventService;
