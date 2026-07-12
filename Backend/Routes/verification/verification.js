// routes/verificationRoutes.js
const express = require('express');
const router = express.Router();
const {authAndRole} = require('../../middlewares/auth');
const {uploadDocument} = require('../../config/multerConfig');
const User = require('../../models/User');
const Verification = require('../../models/Verification');

/**
 * @route GET /api/verification/status/:charityId
 * @desc Get verification status
 * @access Private
 */
router.get('/status/:charityId', authAndRole('admin'), async (req, res) => {
  try {
    const { charityId } = req.params;
    
    const verification = await Verification.findOne({ charityId });
    if (!verification) {
      // Initialize verification record
      const newVerification = new Verification({
        charityId,
        documents: DOCUMENT_REQUIREMENTS.map(doc => ({
          documentId: doc.id,
          status: 'pending',
          required: doc.required,
        })),
        status: 'pending',
      });
      await newVerification.save();
      
      return res.status(200).json({
        success: true,
        data: {
          documents: DOCUMENT_REQUIREMENTS,
          status: 'pending',
          eligibility: {
            isEligible: false,
            missingDocs: DOCUMENT_REQUIREMENTS.filter(d => d.required).map(d => d.label),
            progress: 0,
          },
        },
      });
    }

    // Calculate eligibility
    const requiredDocs = verification.documents.filter(d => d.required);
    const verifiedDocs = requiredDocs.filter(d => d.status === 'verified');
    const rejectedDocs = requiredDocs.filter(d => d.status === 'rejected');
    const missingDocs = requiredDocs.filter(d => d.status === 'pending' || d.status === 'needs-info');

    const isEligible = verifiedDocs.length === requiredDocs.length && rejectedDocs.length === 0;
    const progress = (verifiedDocs.length / requiredDocs.length) * 100;

    res.status(200).json({
      success: true,
      data: {
        documents: verification.documents,
        status: verification.status,
        eligibility: {
          isEligible,
          missingDocs: missingDocs.map(d => d.label),
          progress,
        },
      },
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status',
    });
  }
});

/**
 * @route POST /api/verification/upload/:charityId
 * @desc Upload document
 * @access Private
 */
router.post('/upload/:charityId', authAndRole('admin'), uploadDocument, async (req, res) => {
  try {
    const { charityId } = req.params;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const verification = await Verification.findOne({ charityId });
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification record not found',
      });
    }

    // Update document status
    const document = verification.documents.find(d => d.documentId === documentType);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found',
      });
    }

    document.status = 'submitted';
    document.fileUrl = req.file.path;
    document.uploadedAt = new Date();

    // Update verification status
    if (verification.status === 'pending') {
      verification.status = 'submitted';
    }

    await verification.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        fileUrl: req.file.path,
        status: 'submitted',
      },
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
    });
  }
});

/**
 * @route PUT /api/verification/documents/:charityId/:documentId
 * @desc Admin verify document
 * @access Private (Admin only)
 */
router.put('/documents/:charityId/:documentId', authAndRole('admin'), async (req, res) => {
  try {
    const { charityId, documentId } = req.params;
    const { status, notes } = req.body;

    // Check if user is admin
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const verification = await Verification.findOne({ charityId });
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification record not found',
      });
    }

    const document = verification.documents.find(d => d.documentId === documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    document.status = status;
    document.adminNotes = notes;
    document.verifiedAt = new Date();
    document.verifiedBy = req.userId;

    // Update verification status
    const allVerified = verification.documents.every(d => d.status === 'verified');
    const anyRejected = verification.documents.some(d => d.status === 'rejected');

    if (allVerified) {
      verification.status = 'verified';
    } else if (anyRejected) {
      verification.status = 'rejected';
    } else {
      verification.status = 'submitted';
    }

    await verification.save();

    // If all documents are verified, update charity status
    if (allVerified) {
      await User.findByIdAndUpdate(charityId, {
        isApproved: true,
        isVerified: true,
        verifiedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: {
        status,
        verificationStatus: verification.status,
      },
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify document',
    });
  }
});

/**
 * @route PUT /api/verification/documents/:charityId/verify-all
 * @desc Admin verify all documents
 * @access Private (Admin only)
 */
router.put('/documents/:charityId/verify-all', authAndRole('admin'), async (req, res) => {
  try {
    const { charityId } = req.params;

    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const verification = await Verification.findOne({ charityId });
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification record not found',
      });
    }

    // Verify all pending/submitted documents
    verification.documents.forEach(doc => {
      if (doc.status === 'pending' || doc.status === 'submitted' || doc.status === 'needs-info') {
        doc.status = 'verified';
        doc.verifiedAt = new Date();
        doc.verifiedBy = req.userId;
      }
    });

    verification.status = 'verified';
    await verification.save();

    // Update charity status
    await User.findByIdAndUpdate(charityId, {
      isApproved: true,
      isVerified: true,
      verifiedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'All documents verified successfully',
    });
  } catch (error) {
    console.error('Verify all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify all documents',
    });
  }
});

/**
 * @route POST /api/verification/submit/:charityId
 * @desc Submit for verification
 * @access Private
 */
router.post('/submit/:charityId', authAndRole('admin'), async (req, res) => {
  try {
    const { charityId } = req.params;

    const verification = await Verification.findOne({ charityId });
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification record not found',
      });
    }

    // Check if all required documents are submitted
    const requiredDocs = verification.documents.filter(d => d.required);
    const allSubmitted = requiredDocs.every(d => d.status !== 'pending');

    if (!allSubmitted) {
      return res.status(400).json({
        success: false,
        message: 'Please upload all required documents before submitting',
      });
    }

    verification.status = 'submitted';
    verification.submittedAt = new Date();
    await verification.save();

    // Notify admins (implement email notification)
    // ...

    res.status(200).json({
      success: true,
      message: 'Application submitted for verification',
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit verification',
    });
  }
});

module.exports = router;