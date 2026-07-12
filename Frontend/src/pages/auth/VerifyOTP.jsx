import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Get phone from location state or query params
  useEffect(() => {
    if (!phone) {
      const params = new URLSearchParams(location.search);
      const phoneParam = params.get('phone');
      if (phoneParam) {
        setPhone(phoneParam);
      } else {
        setStatus('error');
        setMessage('Phone number not provided. Please go back and try again.');
      }
    }
  }, [phone, location]);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto submit OTP when all digits are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      handleVerify();
    }
  }, [otp]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedArray = pastedData.slice(0, 6).split('');
    
    const newOtp = [...otp];
    pastedArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus on last filled input
    const lastFilledIndex = Math.min(pastedArray.length - 1, 5);
    if (lastFilledIndex >= 0) {
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setStatus('verifying');
      await verifyOTP(phone, otpString, 'verification'); // Pass purpose for consistency
      setStatus('success');
      setMessage('Phone number verified successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'OTP verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      setCountdown(60);
      await sendOTP(phone, 'verification'); // Pass purpose for consistency
      setMessage('New OTP sent successfully!');
      setStatus('verifying');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      setMessage(error.message || 'Failed to resend OTP.');
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                We've sent a verification code to
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {phone}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={el => inputRefs.current[index] = el}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      padding: '12px 0',
                      width: '100%',
                    }
                  }}
                  sx={{
                    width: 52,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'center',
                    }
                  }}
                />
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleVerify}
              disabled={loading || otp.some(digit => digit === '')}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Didn't receive the code?{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={handleResend}
                  disabled={resendDisabled || loading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#667eea',
                    '&:hover': {
                      backgroundColor: isDark 
                        ? 'rgba(102, 126, 234, 0.1)' 
                        : 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                </Button>
              </Typography>
            </Box>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'rgba(46, 204, 113, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: '#2ecc71' }} />
              </Box>
            </motion.div>
            
            <Typography variant="h5" gutterBottom fontWeight={600} color="success.main">
              Phone Verified!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Redirecting to dashboard...
            </Typography>
          </Box>
        );

      case 'error':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                borderRadius: '50%',
                background: 'rgba(231, 76, 60, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <ErrorIcon sx={{ fontSize: 48, color: '#e74c3c' }} />
            </Box>
            
            <Typography variant="h5" gutterBottom fontWeight={600} color="error.main">
              Verification Failed
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setStatus('verifying');
                  setOtp(['', '', '', '', '', '']);
                  inputRefs.current[0].focus();
                }}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                  },
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/auth/login')}
              >
                Go to Login
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0a12 0%, #141420 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: isDark
            ? 'radial-gradient(circle at 30% 50%, #667eea 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 50%, #ffffff 0%, transparent 50%)',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              background: isDark ? 'rgba(20, 20, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.08)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    margin: '0 auto',
                    borderRadius: '50%',
                    background: isDark 
                      ? 'rgba(123, 147, 232, 0.1)' 
                      : 'rgba(102, 126, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 32, color: '#667eea' }} />
                </Box>
              </motion.div>
              
              <Typography 
                variant="h4" 
                gutterBottom 
                fontWeight={700}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Verify Phone Number
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {status === 'verifying' 
                  ? 'Enter the 6-digit code sent to your phone'
                  : status === 'success'
                  ? 'Phone number verified successfully'
                  : 'There was an issue verifying your phone'
                }
              </Typography>
            </Box>

            {message && status !== 'verifying' && (
              <Alert 
                severity={status === 'success' ? 'success' : 'info'} 
                sx={{ mb: 3 }}
              >
                {message}
              </Alert>
            )}

            {renderContent()}
          </Card>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Need help?{' '}
              <a
                href="/contact"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Contact Support
              </a>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VerifyOTP;