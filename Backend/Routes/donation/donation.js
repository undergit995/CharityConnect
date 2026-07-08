// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const DonationService = require('../services/DonationService');
const { rateLimit } = require('express-rate-limit');

// Rate limiting for donations
const donationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 donations per minute
  message: {
    success: false,
    message: 'Too many donation requests. Please slow down.',
  },
});

/**
 * @route POST /api/donations
 * @desc Process a donation with transaction support
 * @access Private
 */
router.post('/', authMiddleware, donationLimiter, async (req, res) => {
  try {
    const { campaignId, amount, isAnonymous, message, paymentMethod } = req.body;

    // Validate required fields
    if (!campaignId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID and amount are required',
      });
    }

    // Process donation with retry logic
    const result = await DonationService.handleDonationWithRetry(
      { campaignId, amount, isAnonymous, message, paymentMethod },
      req.userId
    );

    res.status(200).json({
      success: true,
      message: 'Donation processed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Donation failed',
      error: error.message,
    });
  }
});

/**
 * @route POST /api/donations/queue
 * @desc Queue donation for processing (non-blocking)
 * @access Private
 */
router.post('/queue', authMiddleware, donationLimiter, async (req, res) => {
  try {
    const { campaignId, amount, isAnonymous, message, paymentMethod } = req.body;

    // Validate
    if (!campaignId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID and amount are required',
      });
    }

    // Queue donation
    const result = await DonationService.queueDonation(
      { campaignId, amount, isAnonymous, message, paymentMethod },
      req.userId
    );

    res.status(200).json({
      success: true,
      message: 'Donation queued for processing',
      data: result,
    });
  } catch (error) {
    console.error('Queue donation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to queue donation',
    });
  }
});

/**
 * @route POST /api/donations/bulk
 * @desc Process bulk donations (admin only)
 * @access Private/Admin
 */
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const { donations } = req.body;
    if (!donations || !Array.isArray(donations) || donations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid donations array required',
      });
    }

    const results = await DonationService.processBulkDonations(donations);

    res.status(200).json({
      success: true,
      message: `Processed ${donations.length} donations`,
      data: results,
    });
  } catch (error) {
    console.error('Bulk donation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Bulk donation failed',
    });
  }
});

/**
 * @route GET /api/donations/campaign/:campaignId
 * @desc Get donation statistics for a campaign
 * @access Public
 */
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;

    const stats = await DonationService.getDonationStats(campaignId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get donation stats',
    });
  }
});

/**
 * @route GET /api/donations/status/:campaignId
 * @desc Get real-time donation status
 * @access Public
 */
router.get('/status/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;

    const status = await DonationService.getRealTimeStatus(campaignId);

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Get donation status error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get donation status',
    });
  }
});

/**
 * @route POST /api/donations/webhook
 * @desc Payment gateway webhook handler
 * @access Public (with signature verification)
 */
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature (implement based on payment gateway)
    const { event, data } = req.body;

    if (event === 'payment.success') {
      // Process successful payment
      const result = await DonationService.handleDonationWithRetry(
        {
          campaignId: data.campaignId,
          amount: data.amount,
          isAnonymous: data.isAnonymous || false,
          message: data.message || '',
          paymentMethod: data.paymentMethod || 'razorpay',
        },
        data.userId
      );

      return res.status(200).json({
        success: true,
        message: 'Webhook processed',
        data: result,
      });
    }

    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
});

module.exports = router;