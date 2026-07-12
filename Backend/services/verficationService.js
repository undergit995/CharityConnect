// services/verificationService.js
import { api } from './authServices';

class VerificationService {
  // Get charity verification status
  async getVerificationStatus(charityId) {
    const response = await api.get(`/verification/status/${charityId}`);
    return response.data;
  }

  // Upload document
  async uploadDocument(charityId, documentType, file) {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);
    
    const response = await api.post(`/verification/upload/${charityId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get all documents for admin
  async getDocumentsForAdmin(charityId) {
    const response = await api.get(`/verification/documents/${charityId}`);
    return response.data;
  }

  // Admin verify document
  async verifyDocument(charityId, documentId, status, notes) {
    const response = await api.put(`/verification/documents/${charityId}/${documentId}`, {
      status,
      notes,
    });
    return response.data;
  }

  // Admin verify all documents
  async verifyAllDocuments(charityId) {
    const response = await api.put(`/verification/documents/${charityId}/verify-all`);
    return response.data;
  }

  // Get verification checklist
  async getVerificationChecklist() {
    const response = await api.get('/verification/checklist');
    return response.data;
  }

  // Submit for verification
  async submitForVerification(charityId) {
    const response = await api.post(`/verification/submit/${charityId}`);
    return response.data;
  }
}

export default new VerificationService();