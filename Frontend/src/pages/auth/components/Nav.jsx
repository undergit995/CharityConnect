import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Favorite as FavoriteIcon,
  VolunteerActivism as VolunteerIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';
import { motion } from 'framer-motion';
export default function Nav() {
    
  const { isDark, toggleTheme } = useTheme();
  return (<AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: isDark ? 'transparent' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                CharityConnect
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                to="/home"
                color="inherit"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': { color: isDark ? '#fff' : '#1a1a2e' },
                }}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/campaigns"
                color="inherit"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': { color: isDark ? '#fff' : '#1a1a2e' },
                }}
              >
                Campaigns
              </Button>
              
              {/* Theme Toggle Button */}
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(30deg)',
                    color: isDark ? '#fff' : '#1a1a2e',
                  },
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <LightIcon /> : <DarkIcon />}
                </motion.div>
              </IconButton>

              <Button
                component={RouterLink}
                to="/auth/register"
                variant="outlined"
                sx={{
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                  color: isDark ? '#fff' : '#1a1a2e',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#667eea',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
  )
}