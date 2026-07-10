import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  VolunteerActivism as DonateIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../Context/AuthContext';
import { api } from '../Services/authServices';
import { formatDistanceToNow, format } from 'date-fns';
import RazorpayDonation from '../payment/RazorpayDonation';
import DonationDialog from '../commonComponents/DonationDialog';



// Donation Lock Manager
class DonationLockManager {
  constructor() {
    this.locks = new Map();
    this.lockTimeout = 30000; // 30 seconds
  }

  acquireLock(campaignId, userId) {
    const now = Date.now();
    const existing = this.locks.get(campaignId);

    if (existing && existing.userId !== userId) {
      const timeRemaining = Math.ceil((existing.expiresAt - now) / 1000);
      if (timeRemaining > 0) {
        throw new Error(
          `Another user is currently processing a donation for this campaign. ` +
          `Please wait ${timeRemaining} seconds and try again.`
        );
      }
    }

    this.locks.set(campaignId, {
      userId,
      expiresAt: now + this.lockTimeout,
    });

    // Auto-cleanup
    setTimeout(() => {
      const current = this.locks.get(campaignId);
      if (current && current.userId === userId) {
        this.locks.delete(campaignId);
      }
    }, this.lockTimeout);

    return true;
  }

  releaseLock(campaignId, userId) {
    const current = this.locks.get(campaignId);
    if (current && current.userId === userId) {
      this.locks.delete(campaignId);
      return true;
    }
    return false;
  }

  getLockStatus(campaignId) {
    const lock = this.locks.get(campaignId);
    if (!lock) return null;
    return {
      locked: true,
      userId: lock.userId,
      expiresAt: lock.expiresAt,
      timeRemaining: Math.ceil((lock.expiresAt - Date.now()) / 1000),
    };
  }
}

// Global donation lock manager instance
const donationLockManager = new DonationLockManager();

// Main Campaign Details Component
const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationOpen, setDonationOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const [lockStatus, setLockStatus] = useState(null);
  const [donationCount, setDonationCount] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);

  // Live donation updates via polling
  const [isLive, setIsLive] = useState(true);
  const pollingRef = useRef(null);

  // Fetch campaign details with locking
  const fetchCampaign = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const response = await api.get(`/campaigns/${id}`, {
        headers: {
          'X-Version': version,
        },
      });
      
      const data = response.data;
      setCampaign(data);
      setVersion(data.__v || 0);
      setDonationCount(data.stats?.donorCount || 0);
      
      // Check lock status
      const lock = donationLockManager.getLockStatus(id);
      setLockStatus(lock);

      // Fetch recent donations
      if (data._id) {
        const donationsRes = await api.get(`/campaigns/${id}/donations`, {
          params: { limit: 5 },
        });
        setRecentDonations(donationsRes.data || []);
      }

    } catch (err) {
      if (err.response?.status === 409) {
        // Conflict detected - refresh data
        setError('Campaign data has been updated. Refreshing...');
        setSnackbarOpen(true);
        fetchCampaign(false);
      } else {
        setError(err.response?.data?.message || 'Failed to load campaign');
        setSnackbarOpen(true);
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [id, version]);

  // Handle donation with optimistic locking
  const handleDonate = useCallback(async (donationData) => {
    setIsProcessing(true);
    setError('');

    try {
      // Try to acquire lock before donation
      donationLockManager.acquireLock(id, user._id);
      
      // Optimistic update - increase donation count and amount
      setDonationCount(prev => prev + 1);
      setCampaign(prev => ({
        ...prev,
        raisedAmount: (prev?.raisedAmount || 0) + donationData.amount,
        stats: {
          ...prev?.stats,
          donorCount: (prev?.stats?.donorCount || 0) + 1,
        },
        __v: (prev?.__v || 0) + 1,
      }));

      // Process donation
      const response = await api.post('/donations', {
        ...donationData,
        campaignId: id,
        version: version,
      });

      // Release lock
      donationLockManager.releaseLock(id, user._id);
      
      setSuccess('Donation successful! Thank you for your generosity! 🎉');
      setSnackbarOpen(true);
      setDonationOpen(false);
      
      // Refresh campaign data
      await fetchCampaign();
      
      return response.data;

    } catch (err) {
      // Release lock on error
      donationLockManager.releaseLock(id, user._id);
      
      // Rollback optimistic update
      setDonationCount(prev => Math.max(0, prev - 1));
      setCampaign(prev => ({
        ...prev,
        raisedAmount: Math.max(0, (prev?.raisedAmount || 0) - donationData.amount),
        stats: {
          ...prev?.stats,
          donorCount: Math.max(0, (prev?.stats?.donorCount || 0) - 1),
        },
        __v: Math.max(0, (prev?.__v || 0) - 1),
      }));

      const errorMessage = err.response?.data?.message || err.message || 'Donation failed. Please try again.';
      setError(errorMessage);
      setSnackbarOpen(true);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [id, user, version, fetchCampaign]);

  // Handle save campaign
  const handleSaveCampaign = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setIsSaved(!isSaved);
    try {
      await api.post(`/campaigns/${id}/save`, { saved: !isSaved });
      setSuccess(isSaved ? 'Campaign removed from saved' : 'Campaign saved!');
      setSnackbarOpen(true);
    } catch (err) {
      setIsSaved(isSaved);
      setError('Failed to save campaign');
      setSnackbarOpen(true);
    }
  }, [id, isSaved, isAuthenticated, navigate]);

  // Handle share
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: campaign?.title,
        text: `Support "${campaign?.title}" on CharityConnect`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSuccess('Link copied to clipboard!');
      setSnackbarOpen(true);
    }
  }, [campaign]);

  // Start live polling for updates
  useEffect(() => {
    fetchCampaign();

    // Poll every 5 seconds for live updates
    pollingRef.current = setInterval(() => {
      if (isLive && !donationOpen) {
        fetchCampaign(true);
      }
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      // Release any locks
      donationLockManager.releaseLock(id, user?._id);
    };
  }, [id, fetchCampaign, isLive, donationOpen, user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Container>
        <Alert severity="error">Campaign not found</Alert>
      </Container>
    );
  }

  const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;
  const isExpired = new Date(campaign.endDate) < new Date();
  const isActive = campaign.status === 'active' && !isExpired;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: isDark ? '#a0a0b8' : '#4a4a6a' }}
        >
          Back
        </Button>

        {/* Lock Status Banner */}
        {lockStatus && lockStatus.locked && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            icon={<LockIcon />}
          >
            Someone is currently viewing this campaign. Donation slot available.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Campaign Info */}
          <Grid item xs={12} md={8}>
            {/* Cover Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 400,
                borderRadius: 3,
                overflow: 'hidden',
                mb: 3,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <Box
                component="img"
                src={campaign.coverImage || '/images/campaign-placeholder.jpg'}
                alt={campaign.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {campaign.isVerified && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                  label="Verified"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(46, 204, 113, 0.9)',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              )}
              {!isActive && (
                <Chip
                  label={isExpired ? 'Expired' : 'Inactive'}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: 'rgba(231, 76, 60, 0.9)',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            {/* Title & Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 1,
                  }}
                >
                  {campaign.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={campaign.category}
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: isDark ? '#e8e8f0' : '#1a1a2e',
                    }}
                  />
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${campaign.stats?.donorCount || 0} donors`}
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: isDark ? '#e8e8f0' : '#1a1a2e',
                    }}
                  />
                  <Chip
                    icon={<CalendarIcon />}
                    label={campaign.daysRemaining > 0 ? `${campaign.daysRemaining} days left` : 'Expired'}
                    size="small"
                    sx={{
                      backgroundColor: campaign.daysRemaining > 0 
                        ? 'rgba(46, 204, 113, 0.15)'
                        : 'rgba(231, 76, 60, 0.15)',
                      color: campaign.daysRemaining > 0 ? '#2ecc71' : '#e74c3c',
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Save Campaign">
                  <IconButton onClick={handleSaveCampaign}>
                    {isSaved ? (
                      <FavoriteIcon sx={{ color: '#e74c3c' }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Description */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                mb: 3,
              }}
            >
              <Typography variant="body1" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', whiteSpace: 'pre-wrap' }}>
                {campaign.description}
              </Typography>
            </Paper>

            {/* Tabs */}
            <Paper
              sx={{
                borderRadius: 3,
                background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                sx={{
                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  px: 2,
                  '& .MuiTab-root': {
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    '&.Mui-selected': {
                      color: '#667eea',
                    },
                  },
                }}
              >
                <Tab label="Updates" />
                <Tab label="Donors" />
                <Tab label="Gallery" />
              </Tabs>

              {/* Updates Tab */}
              <Box sx={{ p: 3 }}>
                {campaign.updates?.length === 0 ? (
                  <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', textAlign: 'center', py: 3 }}>
                    No updates yet
                  </Typography>
                ) : (
                  campaign.updates?.map((update, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                        {update.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mb: 1 }}>
                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                        {update.content}
                      </Typography>
                      {index < campaign.updates.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Donation Card */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                position: 'sticky',
                top: 80,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              {/* Progress */}
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 1 }}>
                <strong style={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  ₹{(campaign.raisedAmount || 0).toLocaleString()}
                </strong>{' '}
                raised of ₹{(campaign.goalAmount || 0).toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 2,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                  },
                }}
              />

              {/* Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block' }}>
                    Donors
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {campaign.stats?.donorCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block' }}>
                    Days Left
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {campaign.daysRemaining > 0 ? campaign.daysRemaining : 0}
                  </Typography>
                </Grid>
              </Grid>

              {/* Donate Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => setDonationOpen(true)}
                disabled={!isActive || !isAuthenticated}
                startIcon={<DonateIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  mb: 2,
                  background: isActive 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  '&:hover': {
                    background: isActive 
                      ? 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)'
                      : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  },
                }}
              >
                {!isAuthenticated 
                  ? 'Login to Donate' 
                  : !isActive 
                    ? 'Campaign Inactive' 
                    : 'Donate Now'
                }
              </Button>

              {/* Charity Info */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={campaign.charityId?.profileImage}
                  sx={{ width: 40, height: 40 }}
                >
                  {campaign.charityId?.fullName?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {campaign.charityId?.charityDetails?.organizationName || campaign.charityId?.fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    {campaign.charityId?.charityDetails?.verified && (
                      <VerifiedIcon sx={{ fontSize: 12, color: '#2ecc71', mr: 0.5 }} />
                    )}
                    Charity
                  </Typography>
                </Box>
              </Box>

              {/* Location */}
              {campaign.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <LocationIcon sx={{ fontSize: 16, color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    {campaign.location}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Donation Dialog */}
        <DonationDialog
          open={donationOpen}
          onClose={() => setDonationOpen(false)}
          campaign={campaign}
          onDonate={handleDonate}
          isProcessing={isProcessing}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            severity={error ? 'error' : 'success'} 
            onClose={() => setSnackbarOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CampaignDetails;