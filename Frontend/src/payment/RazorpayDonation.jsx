import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  InputAdornment,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircleOutlineRounded,
  Person as PersonIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import PanoramaPhotosphereIcon from '@mui/icons-material/PanoramaPhotosphere';
import { useAuth } from '../Context/AuthContext';
import { api } from '../Services/authServices';
import { useTheme } from '../Theme/ThemeContext';

const RazorpayDonation = ({ open, onClose, campaign, onSuccess, guestInfo }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [donationId, setDonationId] = useState(null);
  const [showAnonymousInfo, setShowAnonymousInfo] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  // Load Razorpay script
  useEffect(() => {
    if (open) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [open]);

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleNext = () => {
    if (!amount || parseFloat(amount) < 1) {
      setError('Please enter a valid donation amount (minimum ₹1)');
      return;
    }
    setError('');
    setStep(1);
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleDonate = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ Include anonymous flag in order creation
      const orderResponse = await api.post('/payments/create-order', {
        amount: parseFloat(amount),
        campaignId: campaign._id,
        currency: 'INR',
        isAnonymous: isAnonymous, // ✅ Pass anonymous preference
        message: message,
        guestInfo: guestInfo || null, // ✅ Pass guest info
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { orderId, keyId, donationId: donationIdRes } = orderResponse.data.data;
      setDonationId(donationIdRes);

      // ✅ Build prefill with guest info or user info
      const prefill = {
        name: guestInfo?.name || user?.fullName || '',
        email: guestInfo?.email || user?.email || '',
        contact: guestInfo?.phone || user?.phone || '',
      };

      // ✅ If anonymous, don't send personal info to Razorpay (but keep for receipt)
      const razorpayPrefill = isAnonymous ? {
        name: 'Anonymous Donor',
        email: 'anonymous@charityconnect.com',
        contact: '+0000000000',
      } : prefill;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: parseFloat(amount) * 100,
        currency: 'INR',
        name: 'CharityConnect',
        description: isAnonymous 
          ? `Anonymous Donation to ${campaign.title}` 
          : `Donation to ${campaign.title}`,
        order_id: orderId,
        prefill: razorpayPrefill,
        notes: {
          campaignId: campaign._id,
          isAnonymous: isAnonymous ? 'true' : 'false',
          donorName: prefill.name,
          donorEmail: prefill.email,
          donorPhone: prefill.contact,
          isGuest: guestInfo ? 'true' : 'false',
        },
        theme: {
          color: isAnonymous ? '#2ecc71' : '#667eea',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              donationId: donationIdRes,
              isAnonymous: isAnonymous, // ✅ Pass anonymous flag
            });

            if (verifyResponse.data.success) {
              setSuccess(true);
              setStep(2);
              // ✅ Pass success data with anonymous status
              onSuccess && onSuccess({
                ...verifyResponse.data.data,
                isAnonymous: isAnonymous,
                donorName: isAnonymous ? 'Anonymous' : prefill.name,
              });
            }
          } catch (error) {
            setError(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setError(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(0);
    setAmount('');
    setMessage('');
    setIsAnonymous(false);
    setError('');
    setSuccess(false);
    setShowAnonymousInfo(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Make a Donation
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          You are donating to: <strong>{campaign?.title}</strong>
        </Typography>
        {isAnonymous && (
          <Chip
            icon={<VisibilityOffIcon sx={{ fontSize: 16 }} />}
            label="Anonymous Donation"
            size="small"
            sx={{
              mt: 1,
              backgroundColor: 'rgba(46, 204, 113, 0.15)',
              color: '#2ecc71',
            }}
          />
        )}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            icon={<CheckCircleOutlineRounded />}
          >
            Donation successful! Thank you for your generosity! 🎉
          </Alert>
        )}

        <Stepper activeStep={step} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Amount</StepLabel>
          </Step>
          <Step>
            <StepLabel>Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        {step === 0 && (
          <Box>
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
                    backgroundColor: amount === value.toString() 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
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
              onChange={handleAmountChange}
              placeholder="Enter amount..."
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleNext}
              disabled={!amount || parseFloat(amount) < 1}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              Next
            </Button>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Amount: <strong>₹{amount}</strong>
            </Typography>

            {/* ✅ Anonymous Donation Toggle with Info */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      setShowAnonymousInfo(false);
                    }}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PanoramaPhotosphereIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">Donate anonymously</Typography>
                  </Box>
                }
                sx={{ display: 'block' }}
              />

              {isAnonymous && (
                <Box sx={{ mt: 1 }}>
                  <Alert 
                    severity="info" 
                    sx={{ fontSize: '0.875rem' }}
                    onClose={() => setShowAnonymousInfo(false)}
                  >
                    <Typography variant="body2">
                      <strong>What does anonymous mean?</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      • Your name will not appear on the campaign page
                      • The charity will still receive your donation
                      • You will still receive a receipt via email
                      • Your identity remains private
                    </Typography>
                  </Alert>
                </Box>
              )}
            </Box>

            {/* ✅ Show user info based on anonymous status */}
            {!isAnonymous && guestInfo && (
              <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Donating as:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {guestInfo.name}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  {guestInfo.email} • {guestInfo.phone}
                </Typography>
              </Box>
            )}

            {!isAnonymous && user && (
              <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Donating as:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  {user.email} • {user.phone}
                </Typography>
              </Box>
            )}

            {isAnonymous && (
              <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(46, 204, 113, 0.05)', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                <Typography variant="body2" sx={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityOffIcon sx={{ fontSize: 16 }} />
                  You are donating anonymously
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 0.5 }}>
                  Your identity will not be shared publicly
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              label="Message (Optional)"
              multiline
              rows={3}
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
                onClick={handleDonate}
                disabled={loading}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : isAnonymous ? 'Donate Anonymously' : 'Pay Now'}
              </Button>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutlineRounded sx={{ fontSize: 64, color: '#2ecc71', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Donation Successful! 🎉
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Thank you for your generous donation of <strong>₹{amount}</strong>
            </Typography>
            {isAnonymous && (
              <Chip
                icon={<VisibilityOffIcon sx={{ fontSize: 16 }} />}
                label="Anonymous Donation"
                size="small"
                sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }}
              />
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
              A receipt has been sent to your email
            </Typography>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                mt: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayDonation;