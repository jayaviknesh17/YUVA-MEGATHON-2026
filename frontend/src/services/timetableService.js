import apiClient from './apiClient';

export const timetableService = {
  async getActiveTimetable() {
    return await apiClient.get('/timetable/active');
  },

  async getAllStructures() {
    return await apiClient.get('/timetable/structures');
  },

  async createStructure(data) {
    return await apiClient.post('/timetable/structures', data);
  },

  async updateStructure(id, data) {
    return await apiClient.put(`/timetable/structures/${id}`, data);
  },

  async activateStructure(id) {
    return await apiClient.post(`/timetable/structures/${id}/activate`);
  },

  async addPeriod(structureId, periodData) {
    return await apiClient.post(`/timetable/structures/${structureId}/periods`, periodData);
  },

  async updatePeriod(periodId, periodData) {
    return await apiClient.put(`/timetable/periods/${periodId}`, periodData);
  },

  async deletePeriod(periodId) {
    return await apiClient.delete(`/timetable/periods/${periodId}`);
  },
};

export default timetableService;
