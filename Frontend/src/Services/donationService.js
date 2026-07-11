// services/donationService.js
import { api } from './authServices';

class DonationService {
  // Create Razorpay order
  async createOrder(data) {
    const response = await api.post('/payments/create-order', data);
    return response.data;
  }

  // Verify payment
  async verifyPayment(data) {
    const response = await api.post('/payments/verify', data);
    return response.data;
  }

  // Get donation receipt
  async getReceipt(donationId) {
    const response = await api.get(`/donations/receipt/${donationId}`);
    return response.data;
  }

  // Get donation history for campaign
  async getCampaignDonations(campaignId, limit = 5) {
    const response = await api.get(`/donations/campaign/${campaignId}`, {
      params: { limit },
    });
    return response.data;
  }

  // Get donation status (real-time)
  async getDonationStatus(campaignId) {
    const response = await api.get(`/donations/status/${campaignId}`);
    return response.data;
  }
}

export default new DonationService();