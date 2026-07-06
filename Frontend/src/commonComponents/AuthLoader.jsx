// components/AuthLoader.jsx
import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress, Skeleton } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

export const AuthLoader = ({ variant = 'default', message = 'Loading...' }) => {
  const { isDark } = useTheme();

  // Different loader variants
  const renderLoader = () => {
    switch (variant) {
      case 'minimal':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: isDark ? '#0a0a12' : '#f8f9fa',
              transition: 'background-color 0.3s ease',
            }}
          >
            <CircularProgress
              size={40}
              thickness={4}
              sx={{
                color: 'primary.main',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: isDark ? '#a0a0b8' : '#4a4a6a',
              }}
            >
              {message}
            </Typography>
          </Box>
        );

      case 'skeleton':
        return (
          <Box
            sx={{
              padding: 3,
              background: isDark ? '#0a0a12' : '#f8f9fa',
              minHeight: '100vh',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{
                borderRadius: 2,
                mb: 3,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            />
            <Skeleton
              variant="text"
              height={60}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
            <Skeleton
              variant="text"
              height={40}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Skeleton
                variant="rectangular"
                width={100}
                height={40}
                sx={{ borderRadius: 1, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={40}
                sx={{ borderRadius: 1, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              />
            </Box>
          </Box>
        );

      case 'progress':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: isDark ? '#0a0a12' : '#f8f9fa',
              padding: 3,
              transition: 'background-color 0.3s ease',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
              }}
            >
              {message}
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: isDark ? '#6a6a80' : '#9a9ab0',
              }}
            >
              Please wait...
            </Typography>
          </Box>
        );

      case 'dots':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: isDark ? '#0a0a12' : '#f8f9fa',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    animation: `dotBounce 1.4s ease-in-out ${index * 0.15}s infinite`,
                    opacity: 0.3,
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
              }}
            >
              {message}
            </Typography>
            <style>{`
              @keyframes dotBounce {
                0%, 80%, 100% {
                  transform: scale(0.5);
                  opacity: 0.3;
                }
                40% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `}</style>
          </Box>
        );

      case 'logo':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: isDark ? '#0a0a12' : '#f8f9fa',
              transition: 'background-color 0.3s ease',
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
                opacity: 0.05,
                background: isDark
                  ? 'radial-gradient(circle at 30% 50%, #667eea 0%, transparent 50%)'
                  : 'radial-gradient(circle at 30% 50%, #667eea 0%, transparent 50%)',
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Animated Logo */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'logoPulse 2s ease-in-out infinite',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '2.5rem',
                  }}
                >
                  C
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                  fontWeight: 600,
                  animation: 'fadeInOut 1.5s ease-in-out infinite',
                }}
              >
                CharityConnect
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: isDark ? '#6a6a80' : '#9a9ab0',
                  animation: 'fadeInOut 2s ease-in-out infinite',
                }}
              >
                {message}
              </Typography>
            </Box>

            <style>{`
              @keyframes logoPulse {
                0% {
                  transform: scale(1);
                  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
                }
                50% {
                  transform: scale(1.05);
                  box-shadow: 0 8px 48px rgba(102, 126, 234, 0.5);
                }
                100% {
                  transform: scale(1);
                  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
                }
              }

              @keyframes fadeInOut {
                0%, 100% {
                  opacity: 0.5;
                }
                50% {
                  opacity: 1;
                }
              }
            `}</style>
          </Box>
        );

      default:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: isDark ? '#0a0a12' : '#f8f9fa',
              transition: 'background-color 0.3s ease',
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
                  : 'radial-gradient(circle at 30% 50%, #667eea 0%, transparent 50%)',
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{
                  color: 'primary.main',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                  fontWeight: 500,
                  animation: 'fadeInOut 1.5s ease-in-out infinite',
                }}
              >
                {message}
              </Typography>
            </Box>

            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes fadeInOut {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
              }
            `}</style>
          </Box>
        );
    }
  };

  return renderLoader();
};

export default AuthLoader;