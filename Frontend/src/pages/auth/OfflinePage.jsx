import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import {
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  Refresh as RefreshIcon,
  SignalWifiOff as SignalWifiOffIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const OfflinePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastChecked, setLastChecked] = useState(new Date());

  // Check online status periodically
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection every 30 seconds
    const interval = setInterval(() => {
      setLastChecked(new Date());
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Countdown timer for auto-retry
  useEffect(() => {
    let timer;
    if (retryCountdown > 0) {
      timer = setInterval(() => {
        setRetryCountdown(prev => prev - 1);
      }, 30000);
    } else if (retryCountdown === 0 && !isOnline) {
      // Auto-retry when countdown reaches 0
      handleRetryConnection();
    }
    return () => clearInterval(timer);
  }, [retryCountdown, isOnline]);

  // Handle retry connection
  const handleRetryConnection = async () => {
    if (isReconnecting) return;
    
    setIsReconnecting(true);
    setReconnectAttempts(prev => prev + 1);

    try {
      // Try to fetch a small resource to check connection
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setIsOnline(true);
        window.dispatchEvent(new Event('online'));
        // Redirect to home or reload
        window.location.reload();
      } else {
        throw new Error('Network not available');
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
      // Retry after 5 seconds
      setRetryCountdown(5);
    } finally {
      setIsReconnecting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { rotate: 0, scale: 0 },
    visible: {
      rotate: [0, -10, 10, -10, 10, 0],
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const floatVariants = {
    hidden: { y: 0 },
    visible: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
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
      {/* Animated Background Shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: isDark
            ? 'rgba(123, 147, 232, 0.05)'
            : 'rgba(255, 255, 255, 0.05)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: isDark
            ? 'rgba(123, 147, 232, 0.03)'
            : 'rgba(255, 255, 255, 0.03)',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: isDark
            ? 'rgba(123, 147, 232, 0.02)'
            : 'rgba(255, 255, 255, 0.02)',
          animation: 'pulse 10s ease-in-out infinite',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: isDark ? 'rgba(20, 20, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: isDark
                ? '0 8px 40px rgba(0,0,0,0.4)'
                : '0 8px 40px rgba(0,0,0,0.08)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Status Chip */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Chip
                label={isOnline ? 'Back Online' : 'You are Offline'}
                icon={isOnline ? <WifiIcon /> : <SignalWifiOffIcon />}
                color={isOnline ? 'success' : 'error'}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  py: 1.5,
                  fontSize: '0.875rem',
                  '& .MuiChip-icon': {
                    color: 'inherit',
                  },
                }}
              />
            </Box>

            {/* Icon */}
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate={isReconnecting ? 'pulse' : 'visible'}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: isDark
                    ? 'rgba(231, 76, 60, 0.1)'
                    : 'rgba(231, 76, 60, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                }}
              >
                <WifiOffIcon
                  sx={{
                    fontSize: 60,
                    color: isDark ? '#e74c3c' : '#e74c3c',
                  }}
                />
                {isReconnecting && (
                  <CircularProgress
                    size={130}
                    thickness={2}
                    sx={{
                      position: 'absolute',
                      color: '#667eea',
                    }}
                  />
                )}
              </Box>
            </motion.div>

            {/* Title */}
            <motion.div
              variants={floatVariants}
              initial="hidden"
              animate="visible"
            >
              <Typography
                variant="h3"
                gutterBottom
                fontWeight={700}
                sx={{
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                {isOnline ? "You're Back Online! 🎉" : 'No Internet Connection'}
              </Typography>
            </motion.div>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                mb: 4,
                maxWidth: 500,
                mx: 'auto',
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                lineHeight: 1.8,
              }}
            >
              {isOnline
                ? 'Your connection has been restored. You can continue using CharityConnect.'
                : 'Please check your internet connection. We\'ll automatically reconnect when you\'re back online.'}
            </Typography>

            {/* Connection Status */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mb: 4,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" display="block" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Status
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isOnline ? '#2ecc71' : '#e74c3c',
                  }}
                >
                  {isOnline ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" display="block" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Attempts
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                  }}
                >
                  {reconnectAttempts}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" display="block" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Last Checked
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                  }}
                >
                  {lastChecked.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>

            {/* Progress / Countdown */}
            {!isOnline && retryCountdown > 0 && (
              <Box sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                    Auto-retry in {retryCountdown}s
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                    {retryCountdown}s
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(retryCountdown / 5) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 3,
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={isReconnecting ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                onClick={handleRetryConnection}
                disabled={isReconnecting || isOnline}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isReconnecting ? 'Reconnecting...' : retryCountdown > 0 ? `Retry in ${retryCountdown}s` : 'Try Again'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Go Home
              </Button>
            </Box>

            {/* Tips Section */}
            {!isOnline && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 3,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    fontWeight: 600,
                    display: 'block',
                    mb: 2,
                  }}
                >
                  💡 Troubleshooting Tips
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                  }}
                >
                  {[
                    { icon: <WifiIcon />, text: 'Check your Wi-Fi or mobile data' },
                    { icon: <RefreshIcon />, text: 'Restart your router or modem' },
                    { icon: <ScheduleIcon />, text: 'Wait a moment and try again' },
                    { icon: <EmailIcon />, text: 'Contact support if issue persists' },
                  ].map((tip, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <Box sx={{ color: '#667eea' }}>{tip.icon}</Box>
                      <Typography variant="caption" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                        {tip.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Success Message when back online */}
            {isOnline && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  background: 'rgba(46, 204, 113, 0.08)',
                  border: '1px solid rgba(46, 204, 113, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <CheckCircleIcon sx={{ color: '#2ecc71' }} />
                <Typography variant="body2" sx={{ color: '#2ecc71', fontWeight: 500 }}>
                  Connection restored! Redirecting...
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              © {new Date().getFullYear()} CharityConnect. All rights reserved.
            </Typography>
          </Box>
        </motion.div>
      </Container>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </Box>
  );
};

export default OfflinePage;