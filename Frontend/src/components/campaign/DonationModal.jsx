import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import {
  VolunteerActivism as DonateIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import RazorpayDonation from '../../payment/RazorpayDonation';

const DonationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Donation states
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false); // ✅ Anonymous toggle moved here
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationData, setDonationData] = useState(null);
  
  // Guest user info
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [guestErrors, setGuestErrors] = useState({});

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  // Fetch campaign details
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

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const handleNext = () => {
    // Validate guest info if not authenticated
    if (!isAuthenticated) {
      const errors = {};
      if (!guestInfo.name.trim()) errors.name = 'Name is required';
      if (!guestInfo.email.trim()) errors.email = 'Email is required';
      if (!guestInfo.phone.trim()) errors.phone = 'Phone number is required';
      
      if (Object.keys(errors).length > 0) {
        setGuestErrors(errors);
        return;
      }
    }

    if (!amount || parseFloat(amount) < 1) {
      setError('Please enter a valid donation amount');
      return;
    }
    setError('');
    setStep(1);
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleRazorpaySuccess = (data) => {
    setShowRazorpay(false);
    setDonationSuccess(true);
    setDonationData(data);
    setStep(2);
    
    // Refresh campaign data
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

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
  };

  const handleProceedToPayment = () => {
    setShowRazorpay(true);
  };

  const handleContinueDonating = () => {
    setDonationSuccess(false);
    setStep(0);
    setAmount('');
    setMessage('');
    setIsAnonymous(false);
    setGuestInfo({ name: '', email: '', phone: '' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Campaign not found</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const isActive = campaign.status === 'active' && !campaign.isExpired && campaign.isActive;
  const isGoalReached = campaign.raisedAmount >= campaign.goalAmount;
  const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;
  const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Box sx={{ py: 3, minHeight: '100vh', backgroundColor: isDark ? '#0a0a12' : '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/campaigns/${id}`)}
          sx={{ mb: 3, color: isDark ? '#a0a0b8' : '#4a4a6a' }}
        >
          Back to Campaign
        </Button>

        <Grid container spacing={4}>
          {/* Left Column - Campaign Info */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                position: 'sticky',
                top: 90,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              {/* Campaign Image */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
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
                    label="Verified"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(46, 204, 113, 0.9)',
                      color: '#fff',
                    }}
                  />
                )}
                {isGoalReached && (
                  <Chip
                    label="🎯 Goal Reached!"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: 'rgba(46, 204, 113, 0.9)',
                      color: '#fff',
                    }}
                  />
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e', mb: 1 }}>
                {campaign.title}
              </Typography>

              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 2 }}>
                {campaign.description}
              </Typography>

              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    ₹{campaign.raisedAmount?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                    ₹{campaign.goalAmount?.toLocaleString() || 0}
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
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    {isGoalReached ? '🎯 Goal Reached!' : `${Math.round(progress)}% funded`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    {campaign.stats?.donorCount || 0} donors
                  </Typography>
                </Box>
              </Box>

              {/* Stats */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Donors
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {campaign.stats?.donorCount || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Days Left
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {daysRemaining > 0 ? daysRemaining : 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Category
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {campaign.category}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Charity Info */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={campaign.charityId?.profileImage}>
                  {campaign.charityId?.charityDetails?.organizationName?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {campaign.charityId?.charityDetails?.organizationName || campaign.charityId?.fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    Charity Organization
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Donation Form */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e', mb: 1 }}>
                Make a Donation
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 3 }}>
                Support {campaign.title}
              </Typography>

              {isGoalReached && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  🎯 Goal Reached! Your donation will help create an even bigger impact!
                </Alert>
              )}

              {!isActive && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  {campaign.isExpired ? 'This campaign has expired' : 'This campaign is not active'}
                </Alert>
              )}

              {donationSuccess && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  action={
                    <Button color="inherit" size="small" onClick={handleContinueDonating}>
                      Donate Again
                    </Button>
                  }
                >
                  <Typography variant="body2">
                    <strong>Donation Successful! 🎉</strong> Thank you for your generous donation of 
                    <strong> ₹{donationData?.amount}</strong> to <strong>{campaign.title}</strong>.
                  </Typography>
                </Alert>
              )}

              {/* Stepper */}
              <Stepper activeStep={step} sx={{ mb: 4 }}>
                <Step><StepLabel>Amount & Preferences</StepLabel></Step>
                <Step><StepLabel>Details</StepLabel></Step>
                <Step><StepLabel>Complete</StepLabel></Step>
              </Stepper>

              {/* Step 0: Amount & Preferences (Anonymous toggle here) */}
              {step === 0 && (
                <Box>
                  {/* Guest Info - Only show if not logged in */}
                  {!isAuthenticated && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        Your Information
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="Full Name"
                        value={guestInfo.name}
                        onChange={(e) => {
                          setGuestInfo({ ...guestInfo, name: e.target.value });
                          setGuestErrors({ ...guestErrors, name: '' });
                        }}
                        error={!!guestErrors.name}
                        helperText={guestErrors.name}
                        sx={{ mb: 1.5 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Email Address"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => {
                          setGuestInfo({ ...guestInfo, email: e.target.value });
                          setGuestErrors({ ...guestErrors, email: '' });
                        }}
                        error={!!guestErrors.email}
                        helperText={guestErrors.email}
                        sx={{ mb: 1.5 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Phone Number"
                        value={guestInfo.phone}
                        onChange={(e) => {
                          setGuestInfo({ ...guestInfo, phone: e.target.value });
                          setGuestErrors({ ...guestErrors, phone: '' });
                        }}
                        error={!!guestErrors.phone}
                        helperText={guestErrors.phone}
                      />
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 1 }}>
                        We'll send your donation receipt to this email and phone.
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Select or enter your donation amount
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {quickAmounts.map((value) => (
                      <Button
                        key={value}
                        variant={amount === value.toString() ? 'contained' : 'outlined'}
                        onClick={() => handleAmountSelect(value)}
                        sx={{
                          borderRadius: 2,
                          flex: '1 0 auto',
                          minWidth: 70,
                        }}
                      >
                        ₹{value}
                      </Button>
                    ))}
                  </Box>

                  <TextField
                    fullWidth
                    label="Custom Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter amount..."
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />

                  {/* ✅ Anonymous Donation Toggle - MOVED TO STEP 1 */}
                  <Box sx={{ mt: 3, mb: 2, p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {isAnonymous ? (
                            <VisibilityOffIcon sx={{ fontSize: 18, color: '#2ecc71' }} />
                          ) : (
                            <PersonIcon sx={{ fontSize: 18 }} />
                          )}
                          <Typography variant="body2">
                            {isAnonymous ? 'Donate Anonymously' : 'Donate Publicly'}
                          </Typography>
                        </Box>
                      }
                      sx={{ display: 'block' }}
                    />

                    {isAnonymous && (
                      <Alert 
                        severity="info" 
                        sx={{ mt: 1, fontSize: '0.875rem' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VisibilityOffIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            Your name will not appear on the campaign page. The charity will still receive your donation and you'll get a receipt.
                          </Typography>
                        </Box>
                      </Alert>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    disabled={!amount || parseFloat(amount) < 1 || !isActive}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: isGoalReached && isActive
                        ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: isGoalReached && isActive
                          ? 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)'
                          : 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                      },
                    }}
                  >
                    {!isActive 
                      ? campaign.isExpired ? 'Campaign Expired' : 'Inactive'
                      : 'Next'
                    }
                  </Button>
                </Box>
              )}

              {/* Step 1: Details (Message only) */}
              {step === 1 && (
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Amount: <strong>₹{amount}</strong>
                  </Typography>
                  {isAnonymous && (
                    <Chip
                      icon={<VisibilityOffIcon sx={{ fontSize: 14 }} />}
                      label="Anonymous Donation"
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: 'rgba(46, 204, 113, 0.15)',
                        color: '#2ecc71',
                      }}
                    />
                  )}

                  {!isAuthenticated && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      We'll send your donation receipt to {guestInfo.email}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Message (Optional)"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isAnonymous ? "Leave an anonymous message of support..." : "Leave a message of support..."}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleBack}
                      sx={{ flex: 1, borderRadius: 2 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleProceedToPayment}
                      sx={{
                        flex: 2,
                        py: 1.5,
                        borderRadius: 2,
                        background: isAnonymous 
                          ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: isAnonymous 
                            ? 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)'
                            : 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                        },
                      }}
                    >
                      {isAnonymous ? 'Donate Anonymously' : 'Proceed to Pay'}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 2: Success */}
              {step === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#2ecc71', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e', mb: 1 }}>
                    Donation Successful! 🎉
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 2 }}>
                    Thank you for your generous donation of <strong>₹{amount}</strong>
                  </Typography>
                  {isAnonymous && (
                    <Chip
                      icon={<VisibilityOffIcon sx={{ fontSize: 14 }} />}
                      label="Anonymous Donation"
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: 'rgba(46, 204, 113, 0.15)',
                        color: '#2ecc71',
                      }}
                    />
                  )}
                  {donationData?.receiptNumber && (
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block' }}>
                      Receipt: {donationData.receiptNumber}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/campaigns/${id}`)}
                      sx={{ borderRadius: 2 }}
                    >
                      View Campaign
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleContinueDonating}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      Donate Again
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Security Note */}
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <LockIcon sx={{ fontSize: 16, color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Your payment is secure with Razorpay
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Razorpay Donation Dialog */}
        <RazorpayDonation
          open={showRazorpay}
          onClose={handleRazorpayClose}
          campaign={campaign}
          onSuccess={handleRazorpaySuccess}
          guestInfo={!isAuthenticated ? guestInfo : null}
          amount={amount}
          isAnonymous={isAnonymous}
          message={message}
        />
      </Container>
    </Box>
  );
};

export default DonationPage;