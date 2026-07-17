import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useMediaQuery,
  Stack,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../Context/SettingsContext';

const Footer = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const currentYear = new Date().getFullYear();
  
  const { settings, loading } = useSettings();
  const [error, setError] = useState('');

  const footerData = {
    ...settings,
    copyright: `© ${currentYear} ${settings.brandName}. All rights reserved.`
  };

  // Social media icon mapping
  const getSocialIcon = (platform) => {
    const icons = {
      facebook: <FacebookIcon />,
      twitter: <TwitterIcon />,
      instagram: <InstagramIcon />,
      linkedin: <LinkedInIcon />,
      youtube: <YouTubeIcon />,
    };
    return icons[platform] || null;
  };

  // Social media color mapping
  const getSocialColor = (platform) => {
    const colors = {
      facebook: '#1877f2',
      twitter: '#1DA1F2',
      instagram: '#E4405F',
      linkedin: '#0A66C2',
      youtube: '#FF0000',
    };
    return colors[platform] || '#667eea';
  };

  if (loading) {
    return (
      <Box
        component="footer"
        sx={{
          backgroundColor: isDark ? 'rgba(10,10,18,0.95)' : '#ffffff',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'all 0.3s ease',
          mt: 'auto',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="text" height={40} width="70%" />
                <Skeleton variant="text" height={20} width="90%" />
                <Skeleton variant="text" height={20} width="80%" />
                <Skeleton variant="text" height={20} width="60%" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDark ? 'rgba(10,10,18,0.95)' : '#ffffff',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'all 0.3s ease',
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        {error && (
          <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
            {error} - Using default content
          </Alert>
        )}

        {/* Main Footer */}
        <Grid container spacing={4} sx={{ py: 5 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {footerData?.brandName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                mb: 2,
                maxWidth: 350,
                lineHeight: 1.8,
              }}
            >
              {footerData?.tagline}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {footerData?.socialLinks?.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    '&:hover': {
                      color: getSocialColor(social.platform),
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    width: 40,
                    height: 40,
                  }}
                >
                  {getSocialIcon(social.platform) || social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {footerData?.quickLinks?.map((link) => (
                <Link
                  key={link.label}
                  component="button"
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    '&:hover': {
                      color: '#667eea',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 2,
              }}
            >
              Support
            </Typography>
            <Stack spacing={1.5}>
              {footerData?.supportLinks?.map((link) => (
                <Link
                  key={link.label}
                  component="button"
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    '&:hover': {
                      color: '#667eea',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 2,
              }}
            >
              Get in Touch
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Link
                  href={`mailto:${footerData?.contactInfo?.email}`}
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#667eea' },
                  }}
                >
                  {footerData?.contactInfo?.email}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Link
                  href={`tel:${footerData?.contactInfo?.phone}`}
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#667eea' },
                  }}
                >
                  {footerData?.contactInfo?.phone}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    fontSize: '0.875rem',
                  }}
                >
                  {footerData?.contactInfo?.address}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark ? '#6a6a80' : '#9a9ab0',
              fontSize: '0.8rem',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            {footerData?.copyright}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#6a6a80' : '#9a9ab0',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {footerData?.madeWithLove}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;