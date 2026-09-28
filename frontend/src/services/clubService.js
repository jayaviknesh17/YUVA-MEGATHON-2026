import apiClient from './apiClient';

export const clubService = {
  async getAllClubs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient.get(`/clubs${query ? `?${query}` : ''}`);
  },

  async getClubById(id) {
    return await apiClient.get(`/clubs/${id}`);
  },

  async createClub(clubData) {
    return await apiClient.post('/clubs', clubData);
  },

  async updateClub(id, clubData) {
    return await apiClient.put(`/clubs/${id}`, clubData);
  },

  async archiveClub(id) {
    return await apiClient.patch(`/clubs/${id}/archive`);
  },

  async getClubMembers(clubId) {
    return await apiClient.get(`/clubs/${clubId}/members`);
  },

  async getClubRoles(clubId) {
    return await apiClient.get(`/clubs/${clubId}/roles`);
  },

  async createClubRole(clubId, roleData) {
    return await apiClient.post(`/clubs/${clubId}/roles`, roleData);
  },

  async assignMemberRole(clubId, userId, roleId) {
    return await apiClient.post(`/clubs/${clubId}/members/${userId}/assign-role`, {
      club_role_id: roleId,
    });
  },
};

export default clubService;
