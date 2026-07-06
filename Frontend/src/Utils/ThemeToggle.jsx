import React from 'react';
import {
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  Box,
  useMediaQuery,
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  SettingsBrightness as SystemIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export const ThemeToggle = ({ variant = 'icon', size = 'medium' }) => {
  const { mode, toggleTheme, isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const iconSize = size === 'small' ? 20 : size === 'large' ? 28 : 24;

  if (variant === 'icon') {
    return (
      <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          size={size}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(30deg)',
            },
          }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <LightIcon sx={{ fontSize: iconSize }} />
            ) : (
              <DarkIcon sx={{ fontSize: iconSize }} />
            )}
          </motion.div>
        </IconButton>
      </Tooltip>
    );
  }

  if (variant === 'switch') {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            color="primary"
            size={size}
            sx={{
              '& .MuiSwitch-switchBase': {
                color: '#667eea',
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#7b93e8',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#7b93e8',
              },
            }}
          />
        }
        label={isDark ? 'Dark Mode' : 'Light Mode'}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontWeight: 500,
            color: isDark ? 'text.primary' : 'text.primary',
          },
        }}
      />
    );
  }

  if (variant === 'button') {
    return (
      <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
        <Box
          onClick={toggleTheme}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
          }}
        >
          {isDark ? (
            <LightIcon sx={{ fontSize: iconSize }} />
          ) : (
            <DarkIcon sx={{ fontSize: iconSize }} />
          )}
          <Box
            component="span"
            sx={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              fontWeight: 500,
            }}
          >
            {isDark ? 'Dark' : 'Light'}
          </Box>
        </Box>
      </Tooltip>
    );
  }

  return null;
};

// Theme Settings Component
export const ThemeSettings = () => {
  const { mode, setThemeMode, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: <LightIcon />, label: 'Light' },
    { value: 'dark', icon: <DarkIcon />, label: 'Dark' },
    { value: 'system', icon: <SystemIcon />, label: 'System' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {themes.map((theme) => (
        <Box
          key={theme.value}
          onClick={() => setThemeMode(theme.value)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            padding: '12px 20px',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '2px solid',
            borderColor: mode === theme.value ? 'primary.main' : 'transparent',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
          }}
        >
          {theme.icon}
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {theme.label}
          </span>
        </Box>
      ))}
    </Box>
  );
};