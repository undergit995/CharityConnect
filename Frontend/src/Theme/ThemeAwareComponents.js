import React from 'react';
import { Box, Paper, Card, Typography, styled } from '@mui/material';
import { useTheme, useThemeStyles, useThemeTransition } from '../hooks/useTheme';

// Styled components with theme awareness
export const ThemeAwarePaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
}));

export const ThemeAwareCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

export const ThemeAwareBox = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
}));

export const GradientCard = ({ children, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <Card
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, #1a1a2e 0%, #141420 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: 3,
        padding: 3,
        transition: 'all 0.3s ease-in-out',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export const GlassCard = ({ children, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <Paper
      sx={{
        background: isDark
          ? 'rgba(20, 20, 32, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 3,
        padding: 3,
        transition: 'all 0.3s ease-in-out',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

// Theme-aware typography
export const ThemedTypography = ({ children, variant = 'body1', ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <Typography
      variant={variant}
      sx={{
        color: isDark ? '#e8e8f0' : '#1a1a2e',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};