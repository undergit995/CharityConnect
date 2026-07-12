// services/verificationService.js
import { api } from './authServices';

class VerificationService {
  /**
   * Get charity verification status
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - Verification status data
   */
  async getVerificationStatus(charityId) {
    try {
      const response = await api.get(`/verification/status/${charityId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get verification status error:', error);
      throw error;
    }
  }

  /**
   * Upload a document for verification
   * @param {string} charityId - Charity user ID
   * @param {string} documentType - Document type identifier
   * @param {File} file - File to upload
   * @returns {Promise} - Upload response
   */
  async uploadDocument(charityId, documentType, file) {
    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('file', file);

      const response = await api.post(`/verification/upload/${charityId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  /**
   * Get all documents for a charity (Admin only)
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - Documents data
   */
  async getDocumentsForAdmin(charityId) {
    try {
      const response = await api.get(`/verification/documents/${charityId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  /**
   * Admin verify a document
   * @param {string} charityId - Charity user ID
   * @param {string} documentId - Document ID
   * @param {string} status - New status (verified, rejected, needs-info)
   * @param {string} notes - Admin notes/rejection reason
   * @returns {Promise} - Verification response
   */
  async verifyDocument(charityId, documentId, status, notes = '') {
    try {
      const response = await api.put(`/verification/documents/${charityId}/${documentId}`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Verify document error:', error);
      throw error;
    }
  }

  /**
   * Admin verify all documents at once
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - Verification response
   */
  async verifyAllDocuments(charityId) {
    try {
      const response = await api.put(`/verification/documents/${charityId}/verify-all`);
      return response.data;
    } catch (error) {
      console.error('Verify all documents error:', error);
      throw error;
    }
  }

  /**
   * Get verification checklist with document requirements
   * @returns {Promise} - Checklist data
   */
  async getVerificationChecklist() {
    try {
      const response = await api.get('/verification/checklist');
      return response.data.data;
    } catch (error) {
      console.error('Get checklist error:', error);
      throw error;
    }
  }

  /**
   * Submit charity for verification review
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - Submission response
   */
  async submitForVerification(charityId) {
    try {
      const response = await api.post(`/verification/submit/${charityId}`);
      return response.data;
    } catch (error) {
      console.error('Submit for verification error:', error);
      throw error;
    }
  }

  /**
   * Get verification history/audit trail
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - History data
   */
  async getVerificationHistory(charityId) {
    try {
      const response = await api.get(`/verification/history/${charityId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get verification history error:', error);
      throw error;
    }
  }

  /**
   * Get document download URL
   * @param {string} charityId - Charity user ID
   * @param {string} documentId - Document ID
   * @returns {Promise} - Download URL
   */
  async getDocumentDownloadUrl(charityId, documentId) {
    try {
      const response = await api.get(`/verification/download/${charityId}/${documentId}`);
      return response.data.data.downloadUrl;
    } catch (error) {
      console.error('Get download URL error:', error);
      throw error;
    }
  }

  /**
   * Get verification statistics (Admin only)
   * @param {Object} filters - Date filters
   * @returns {Promise} - Statistics data
   */
  async getVerificationStats(filters = {}) {
    try {
      const response = await api.get('/verification/stats', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Get verification stats error:', error);
      throw error;
    }
  }

  /**
   * Get pending verifications (Admin only)
   * @param {Object} params - Pagination and filter params
   * @returns {Promise} - Pending verifications data
   */
  async getPendingVerifications(params = {}) {
    try {
      const response = await api.get('/verification/pending', { params });
      return response.data;
    } catch (error) {
      console.error('Get pending verifications error:', error);
      throw error;
    }
  }

  /**
   * Bulk update document status (Admin only)
   * @param {Array} updates - Array of {documentId, status, notes}
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - Update response
   */
  async bulkUpdateDocuments(charityId, updates) {
    try {
      const response = await api.put(`/verification/bulk-update/${charityId}`, { updates });
      return response.data;
    } catch (error) {
      console.error('Bulk update documents error:', error);
      throw error;
    }
  }

  /**
   * Resend verification request email to charity
   * @param {string} charityId - Charity user ID
   * @param {string} notes - Additional instructions
   * @returns {Promise} - Email response
   */
  async resendVerificationRequest(charityId, notes = '') {
    try {
      const response = await api.post(`/verification/resend-request/${charityId}`, { notes });
      return response.data;
    } catch (error) {
      console.error('Resend verification request error:', error);
      throw error;
    }
  }

  /**
   * Check if charity is eligible for fundraising
   * @param {string} charityId - Charity user ID
   * @returns {Promise} - Eligibility status
   */
  async checkEligibility(charityId) {
    try {
      const response = await api.get(`/verification/eligibility/${charityId}`);
      return response.data.data;
    } catch (error) {
      console.error('Check eligibility error:', error);
      throw error;
    }
  }
}

export default new VerificationService();