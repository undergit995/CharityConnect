import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const { verifyEmail, resendVerificationEmail, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Verify email on mount
  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus('error');
      setMessage('No verification token found. Please check your email link.');
    }
  }, [token]);

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

  const handleVerification = async () => {
    try {
      setStatus('verifying');
      const response = await verifyEmail(token);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Email verification failed. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please provide your email address to resend verification.');
      return;
    }

    try {
      setResendDisabled(true);
      setCountdown(60);
      await resendVerificationEmail(email);
      setMessage('Verification email sent successfully! Please check your inbox.');
    } catch (error) {
      setMessage(error.message || 'Failed to resend verification email.');
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  // Animation variants
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

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: isDark 
                    ? 'rgba(123, 147, 232, 0.1)' 
                    : 'rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <CircularProgress size={40} color="primary" />
              </Box>
            </motion.div>
            
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Verifying Your Email
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please wait while we verify your email address...
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
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
              Email Verified!
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
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
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
            </motion.div>
            
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
                onClick={handleVerification}
                disabled={loading}
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
                component={RouterLink}
                to="/auth/login"
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
      {/* Animated Background */}
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
            {/* Header */}
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
                  <EmailIcon sx={{ fontSize: 32, color: '#667eea' }} />
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
                Email Verification
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {status === 'verifying' 
                  ? 'Please wait while we verify your email address'
                  : status === 'success'
                  ? 'Your email has been verified successfully'
                  : 'There was an issue verifying your email'
                }
              </Typography>
            </Box>

            {/* Content */}
            {renderContent()}

            {/* Footer */}
            {status !== 'verifying' && status !== 'success' && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Didn't receive the email?{' '}
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleResendVerification}
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
                    {resendDisabled ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                  </Button>
                </Typography>
                
                {email && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Sending to: {email}
                  </Typography>
                )}
              </Box>
            )}
          </Card>

          {/* Help Links */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Need help?{' '}
              <RouterLink
                to="/contact"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Contact Support
              </RouterLink>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VerifyEmail;