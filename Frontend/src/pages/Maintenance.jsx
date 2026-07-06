import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

const Maintenance = () => {
  const { isDark } = useTheme();

  // Estimated time (in minutes)
  const estimatedTime = 30;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { rotate: -180, scale: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: '65%',
      transition: {
        duration: 2,
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


      {[0, 1, 2, 3, 4].map((index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            opacity: 0.05,
            fontSize: 80,
            animation: `float ${15 + index * 2}s ease-in-out infinite`,
            left: `${10 + index * 20}%`,
            top: `${10 + index * 20}%`,
            transform: `rotate(${index * 45}deg)`,
          }}
        >
          <ConstructionIcon sx={{ fontSize: 80 }} />
        </Box>
      ))}

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
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.08)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Status Chip */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Chip
                label="Under Maintenance"
                color="warning"
                icon={<BuildIcon />}
                sx={{
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  fontSize: '0.875rem',
                  '& .MuiChip-icon': {
                    color: 'inherit',
                  },
                }}
              />
            </Box>

            {/* Icon */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    borderRadius: '50%',
                    background: isDark
                      ? 'rgba(255, 193, 7, 0.1)'
                      : 'rgba(255, 193, 7, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <ConstructionIcon
                    sx={{
                      fontSize: 48,
                      color: isDark ? '#ffd54f' : '#f39c12',
                      animation: 'gearSpin 4s linear infinite',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: isDark ? '#141420' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'gearSpin 3s linear infinite reverse',
                    }}
                  >
                    <BuildIcon
                      sx={{
                        fontSize: 16,
                        color: isDark ? '#ffd54f' : '#f39c12',
                      }}
                    />
                  </Box>
                </Box>
              </motion.div>
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              fontWeight={700}
              sx={{
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 2,
              }}
            >
              We'll Be Back Soon!
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              align="center"
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                mb: 4,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              We're currently performing scheduled maintenance to improve your experience.
              Our team is working hard to get everything back up and running.
            </Typography>

            {/* Progress Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  Progress
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', fontWeight: 600 }}>
                  65%
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', height: 8 }}>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Info Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 2,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  textAlign: 'center',
                }}
              >
                <ScheduleIcon
                  sx={{
                    fontSize: 24,
                    color: '#667eea',
                    mb: 1,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  Estimated Time
                </Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', fontWeight: 600 }}>
                  ~{estimatedTime} mins
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  textAlign: 'center',
                }}
              >
                <BuildIcon
                  sx={{
                    fontSize: 24,
                    color: '#764ba2',
                    mb: 1,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  Status
                </Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', fontWeight: 600 }}>
                  In Progress
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  textAlign: 'center',
                }}
              >
                <RefreshIcon
                  sx={{
                    fontSize: 24,
                    color: '#2ecc71',
                    mb: 1,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  Last Update
                </Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', fontWeight: 600 }}>
                  Just Now
                </Typography>
              </Box>
            </Box>

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
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                sx={{
                  py: 1.5,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                  },
                }}
              >
                Check Again
              </Button>

              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                href="mailto:support@charityconnect.com"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>

            {/* Social Links */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                pt: 2,
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Button
                size="small"
                startIcon={<TwitterIcon />}
                href="https://twitter.com/charityconnect"
                target="_blank"
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  '&:hover': {
                    color: '#1DA1F2',
                  },
                }}
              >
                Twitter
              </Button>
              <Button
                size="small"
                startIcon={<GitHubIcon />}
                href="https://github.com/charityconnect"
                target="_blank"
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  '&:hover': {
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                  },
                }}
              >
                GitHub
              </Button>
            </Box>

            {/* Maintenance Note */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: isDark ? 'rgba(255, 193, 7, 0.05)' : 'rgba(255, 193, 7, 0.05)',
                border: `1px solid ${isDark ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.1)'}`,
              }}
            >
              <Typography
                variant="caption"
                align="center"
                display="block"
                sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
              >
                💡 We'll notify you via email once the maintenance is complete.
                No data will be lost during this process.
              </Typography>
            </Box>
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
        @keyframes gearSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(${Math.random() * 45}deg);
          }
          50% {
            transform: translateY(-20px) rotate(${Math.random() * 45}deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default Maintenance;