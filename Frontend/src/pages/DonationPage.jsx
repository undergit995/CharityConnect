import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Divider,
  LinearProgress,
  Chip,
  useMediaQuery,
} from '@mui/material';
import {
  VolunteerActivism as DonateIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../Context/AuthContext';
import { api } from '../Services/authServices';
import RazorpayDonation from '../payment/RazorpayDonation';

const DonationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationOpen, setDonationOpen] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/campaigns/${id}/donate` } });
    }
  }, [isAuthenticated, navigate, id]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}/donate`);
        setCampaign(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const handleDonationSuccess = (data) => {
    setDonationSuccess(true);
    setDonationData(data);
    const fetchUpdatedCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}/donate`);
        setCampaign(response.data.data);
      } catch (err) {
        // Ignore refresh error
      }
    };
    fetchUpdatedCampaign();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !campaign) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={() => navigate(-1)} variant="contained">
          Go Back
        </Button>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Campaign not found</Alert>
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;
  const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isActive = campaign.status === 'active' && daysRemaining > 0;

  return (
    <Box sx={{ py: 3, minHeight: '100vh', backgroundColor: isDark ? '#0a0a12' : '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/donor/campaign`)}
            sx={{
              mb: 3,
              color: isDark ? '#a0a0b8' : '#4a4a6a',
              '&:hover': {
                color: isDark ? '#e8e8f0' : '#1a1a2e',
              },
            }}
          >
            Back to Campaign
          </Button>
        </motion.div>

        {/* Success Message */}
        {donationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={() => navigate('/donor/donations')}>
                  View My Donations
                </Button>
              }
            >
              <Typography variant="body2">
                <strong>Donation Successful! 🎉</strong> Thank you for your generous donation of 
                <strong> ₹{donationData?.amount}</strong> to <strong>{campaign.title}</strong>.
                {donationData?.receiptNumber && (
                  <span> Receipt: <strong>{donationData.receiptNumber}</strong></span>
                )}
              </Typography>
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Campaign Info */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                {/* Campaign Image */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 250,
                    borderRadius: 2,
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
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(46, 204, 113, 0.9)',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {!isActive && (
                    <Chip
                      label={daysRemaining <= 0 ? 'Expired' : 'Inactive'}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: 'rgba(231, 76, 60, 0.9)',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                {/* Campaign Details */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 1,
                  }}
                >
                  {campaign.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={campaign.category}
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: isDark ? '#e8e8f0' : '#1a1a2e',
                    }}
                  />
                  {campaign.location && (
                    <Chip
                      icon={<LocationIcon sx={{ fontSize: 14 }} />}
                      label={campaign.location}
                      size="small"
                      sx={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        color: isDark ? '#e8e8f0' : '#1a1a2e',
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    mb: 3,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {campaign.description}
                </Typography>

                {/* Progress */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      ₹{campaign.raisedAmount?.toLocaleString('en-IN') || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      ₹{campaign.goalAmount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        background: progress >= 100 
                          ? '#2ecc71'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      {Math.round(progress)}% funded
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      {campaign.stats?.donorCount || 0} donors
                    </Typography>
                  </Box>
                </Box>

                {/* Stats */}
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Days Left
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {daysRemaining > 0 ? daysRemaining : 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Donors
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {campaign.stats?.donorCount || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Status
                    </Typography>
                    <Chip
                      label={isActive ? 'Active' : daysRemaining <= 0 ? 'Expired' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: isActive 
                          ? 'rgba(46, 204, 113, 0.15)'
                          : 'rgba(231, 76, 60, 0.15)',
                        color: isActive ? '#2ecc71' : '#e74c3c',
                        fontWeight: 600,
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Charity Info */}
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {campaign.charityId?.charityDetails?.organizationName?.charAt(0) || 'C'}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {campaign.charityId?.charityDetails?.organizationName || campaign.charityId?.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      {campaign.charityId?.charityDetails?.verified && (
                        <VerifiedIcon sx={{ fontSize: 12, color: '#2ecc71', mr: 0.5 }} />
                      )}
                      Charity Organization
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right Column - Donation Card */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  position: 'sticky',
                  top: 90,
                  background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 40, color: '#667eea' }} />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 1,
                  }}
                >
                  Make a Difference
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    mb: 3,
                  }}
                >
                  Your donation of any amount helps {campaign.title}
                </Typography>

                {/* Quick Impact Stats */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Raised
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2ecc71' }}>
                      ₹{campaign.raisedAmount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Goal
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      ₹{campaign.goalAmount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Box>
                </Box>

                {/* Donate Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setDonationOpen(true)}
                  disabled={!isActive}
                  startIcon={<DonateIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: isActive 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    '&:hover': {
                      background: isActive 
                        ? 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)'
                        : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      transform: isActive ? 'translateY(-2px)' : 'none',
                      boxShadow: isActive ? '0 8px 30px rgba(102,126,234,0.3)' : 'none',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {!isAuthenticated 
                    ? 'Login to Donate' 
                    : !isActive 
                      ? daysRemaining <= 0 ? 'Campaign Expired' : 'Campaign Inactive'
                      : 'Donate Now'
                  }
                </Button>

                {/* Security Note */}
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <LockIcon sx={{ fontSize: 16, color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    Secure payment with Razorpay
                  </Typography>
                </Box>

                {/* Trust Badges */}
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Chip
                    icon={<SecurityIcon sx={{ fontSize: 14 }} />}
                    label="100% Secure"
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    }}
                  />
                  <Chip
                    label="Verified Charity"
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Razorpay Donation Dialog */}
      <RazorpayDonation
        open={donationOpen}
        onClose={() => setDonationOpen(false)}
        campaign={campaign}
        onSuccess={handleDonationSuccess}
      />
    </Box>
  );
};

export default DonationPage;