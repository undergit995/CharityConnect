import { api } from './authServices';

class CampaignService {
  // Get campaign details
  async getCampaign(id) {
    const response = await api.get(`/campaigns/${id}`);
    return response.data.data;
  }

  // Get campaign for donation page
  async getCampaignForDonation(id) {
    const response = await api.get(`/campaigns/${id}/donate`);
    return response.data.data;
  }

  // Get all campaigns with filters
  async getCampaigns(filters = {}) {
    const response = await api.get('/campaigns', { params: filters });
    return response.data;
  }

  // Save campaign
  async saveCampaign(campaignId, action) {
    const response = await api.post(`/campaigns/${campaignId}/save`, { action });
    return response.data;
  }

  // Get campaign stats
  async getCampaignStats(campaignId) {
    const response = await api.get(`/campaigns/${campaignId}/stats`);
    return response.data;
  }

  // Get campaign donations
  async getCampaignDonations(campaignId, limit = 5) {
    const response = await api.get(`/campaigns/${campaignId}/donations`, {
      params: { limit },
    });
    return response.data;
  }
}

export default new CampaignService();