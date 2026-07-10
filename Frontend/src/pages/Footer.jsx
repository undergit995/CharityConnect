// components/Footer.jsx
import React from 'react';
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

const Footer = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { label: 'Help Center', path: '/help' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com/charityconnect', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com/charityconnect', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com/charityconnect', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/company/charityconnect', label: 'LinkedIn' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com/charityconnect', label: 'YouTube' },
  ];

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
              CharityConnect
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
              Connecting donors with verified charities to make a difference in communities around the world.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    '&:hover': {
                      color: '#667eea',
                      backgroundColor: isDark ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    width: 40,
                    height: 40,
                  }}
                >
                  {social.icon}
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
              {quickLinks.map((link) => (
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
              {supportLinks.map((link) => (
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
                  href="mailto:support@charityconnect.com"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#667eea' },
                  }}
                >
                  support@charityconnect.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Link
                  href="tel:+1234567890"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#667eea' },
                  }}
                >
                  +1 (234) 567-890
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
                  123 Charity Street, Giving City, GC 12345
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
            © {currentYear} CharityConnect. All rights reserved.
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
              Made with
              <FavoriteIcon sx={{ fontSize: 14, color: '#e74c3c' }} />
              for a better world
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;