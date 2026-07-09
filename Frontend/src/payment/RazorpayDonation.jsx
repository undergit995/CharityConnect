// components/Donation/RazorpayDonation.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { api } from '../Services/authServices';
import { useTheme } from '../Theme/ThemeContext';
import { CheckCircleOutlineRounded } from '@mui/icons-material';

const RazorpayDonation = ({ open, onClose, campaign, onSuccess }) => {
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
  };

  const handleNext = () => {
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

  const handleDonate = async () => {
    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const orderResponse = await api.post('/payments/create-order', {
        amount: parseFloat(amount),
        campaignId: campaign._id,
        currency: 'INR',
        isAnonymous,
        message,
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { orderId, keyId, donationId: donationIdRes } = orderResponse.data.data;
      setDonationId(donationIdRes);

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: parseFloat(amount) * 100,
        currency: 'INR',
        name: 'CharityConnect',
        description: `Donation to ${campaign.title}`,
        order_id: orderId,
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          campaignId: campaign._id,
          isAnonymous: isAnonymous ? 'true' : 'false',
        },
        theme: {
          color: '#667eea',
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
            });

            if (verifyResponse.data.success) {
              setSuccess(true);
              setStep(2);
              onSuccess && onSuccess(verifyResponse.data.data);
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
      <DialogTitle sx={{ fontWeight: 700 }}>
        Make a Donation
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            You are donating to: <strong>{campaign?.title}</strong>
          </Typography>
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Donation successful! Thank you for your generosity! 🎉
          </Alert>
        )}

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
              onChange={(e) => setAmount(e.target.value)}
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

            <FormControlLabel
              control={
                <Switch
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  color="primary"
                />
              }
              label="Donate anonymously"
              sx={{ mb: 2, display: 'block' }}
            />

            <TextField
              fullWidth
              label="Message (Optional)"
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support..."
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
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
              Thank you for your generous donation of ₹{amount}
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