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
import { useAuth } from '../hooks/useAuth';
import { api } from '../Services/authServices';
import { formatDistanceToNow, format } from 'date-fns';
import RazorpayDonation from '../payment/RazorpayDonation';



const DonationDialog = ({ 
  open, 
  onClose, 
  campaign, 
  onSuccess,
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const [lockAcquired, setLockAcquired] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [error, setError] = useState('');
  const [lockTimeout, setLockTimeout] = useState(null);
  const [showRazorpay, setShowRazorpay] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  // Acquire lock when dialog opens
  useEffect(() => {
    if (open && campaign && user) {
      try {
        donationLockManager.acquireLock(campaign._id, user._id);
        setLockAcquired(true);
        setLockInfo(donationLockManager.getLockStatus(campaign._id));
        setError('');

        // Set timeout to refresh lock
        const timeout = setInterval(() => {
          try {
            donationLockManager.acquireLock(campaign._id, user._id);
            setLockInfo(donationLockManager.getLockStatus(campaign._id));
          } catch (err) {
            setError('Donation lock expired. Please try again.');
            onClose();
          }
        }, 15000); // Refresh every 15 seconds

        setLockTimeout(timeout);
      } catch (err) {
        setError(err.message);
        setLockAcquired(false);
      }
    }

    return () => {
      if (lockTimeout) {
        clearInterval(lockTimeout);
      }
      if (campaign && user) {
        donationLockManager.releaseLock(campaign._id, user._id);
      }
    };
  }, [open, campaign, user, onClose]);

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
      setError('Please enter a valid donation amount');
      return;
    }
    if (!lockAcquired) {
      setError('Donation lock not acquired. Please try again.');
      return;
    }
    setError('');
    setStep(1);
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleRazorpaySuccess = (data) => {
    // Release lock on success
    donationLockManager.releaseLock(campaign._id, user._id);
    setShowRazorpay(false);
    setStep(2);
    
    if (onSuccess) {
      onSuccess(data);
    }

    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
      setStep(0);
      setAmount('');
      setMessage('');
      setIsAnonymous(false);
    }, 3000);
  };

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
    // Don't release lock here, user might try again
  };

  const handleProceedToPayment = () => {
    setShowRazorpay(true);
  };

  const handleClose = () => {
    donationLockManager.releaseLock(campaign?._id, user?._id);
    setStep(0);
    setAmount('');
    setMessage('');
    setIsAnonymous(false);
    setError('');
    setShowRazorpay(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open && !showRazorpay}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            minHeight: 400,
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {campaign?.title}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {/* Lock Status */}
          {lockAcquired && lockInfo && (
            <Alert 
              severity="info" 
              sx={{ mb: 2 }}
              icon={<LockIcon />}
            >
              Donation slot locked for {lockInfo.timeRemaining} seconds
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => setError('')}
              action={
                error.includes('lock') && (
                  <Button color="inherit" size="small" onClick={() => {
                    donationLockManager.releaseLock(campaign._id, user._id);
                    setLockAcquired(false);
                    setError('');
                  }}>
                    Retry
                  </Button>
                )
              }
            >
              {error}
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
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 2 }}>
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
                      '&:hover': {
                        borderColor: '#667eea',
                      },
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
                disabled={!amount || parseFloat(amount) < 1 || !lockAcquired}
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
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 2 }}>
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
                  onClick={handleProceedToPayment}
                  disabled={!lockAcquired}
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
                  Proceed to Pay
                </Button>
              </Box>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#2ecc71', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e', mb: 1 }}>
                Donation Successful! 🎉
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Thank you for your generous donation of ₹{amount}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Razorpay Donation Dialog */}
      <RazorpayDonation
        open={showRazorpay}
        onClose={handleRazorpayClose}
        campaign={campaign}
        onSuccess={handleRazorpaySuccess}
      />
    </>
  );
};


export default DonationDialog;