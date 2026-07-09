const express = require('express');
const router = express.Router();
const { authAndRole } = require('../../middlewares/auth');
const charityController = require('../../Controllers/charity/charityController');
const { formatDistanceToNow } = require('date-fns');

// ==================== CHARITY CAMPAIGN ROUTES ====================

/**
 * @route GET /api/charity/campaigns
 * @desc Get all campaigns for the logged-in charity
 * @access Private (Charity only)
 */
router.get('/campaigns', authAndRole('charity'), charityController.getCharityCampaigns);

/**
 * @route GET /api/charity/campaigns/:id
 * @desc Get single campaign for charity
 * @access Private (Charity owner)
 */
router.get('/campaigns/:id', authAndRole('charity'), charityController.getCampaignById);

/**
 * @route PUT /api/charity/campaigns/:id/submit
 * @desc Submit campaign for review
 * @access Private (Charity owner)
 */
router.put('/campaigns/:id/submit', authAndRole('charity'), charityController.submitCampaignForReview);

/**
 * @route PUT /api/charity/campaigns/:id/pause
 * @desc Pause campaign
 * @access Private (Charity owner)
 */
router.put('/campaigns/:id/pause', authAndRole('charity'), charityController.pauseCampaign);

/**
 * @route PUT /api/charity/campaigns/:id/resume
 * @desc Resume campaign
 * @access Private (Charity owner)
 */
router.put('/campaigns/:id/resume', authAndRole('charity'), charityController.resumeCampaign);

/**
 * @route PUT /api/charity/campaigns/:id/complete
 * @desc Complete campaign
 * @access Private (Charity owner)
 */
router.put('/campaigns/:id/complete', authAndRole('charity'), charityController.completeCampaign);

/**
 * @route PUT /api/charity/campaigns/:id/cancel-request
 * @desc Cancel pending request
 * @access Private (Charity owner)
 */
router.put('/campaigns/:id/cancel-request', authAndRole('charity'), charityController.cancelRequest);

/**
 * @route DELETE /api/charity/campaigns/:id
 * @desc Delete campaign (soft delete)
 * @access Private (Charity owner)
 */
router.delete('/campaigns/:id', authAndRole('charity'), charityController.deleteCampaign);

/**
 * @route GET /api/charity/campaigns/stats
 * @desc Get campaign statistics
 * @access Private (Charity)
 */
router.get('/campaigns/stats', authAndRole('charity'), charityController.getCampaignStats);

/**
 * @route POST /api/charity/campaigns/resolve-conflict
 * @desc Resolve version conflict
 * @access Private (Charity)
 */
router.post('/campaigns/resolve-conflict', authAndRole('charity'), charityController.resolveConflict);
// routes/charityRoutes.js

/**
 * @route GET /api/charity/dashboard/stats
 * @desc Get charity dashboard statistics
 * @access Private (Charity only)
 */
router.get("/dashboard/stats", authAndRole('charity'), charityController.getDashboardStats);

module.exports = router;