import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
  width: '100%',
  maxWidth: 480,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  }
}));

const AuthLayout = ({ children, title, subtitle, illustration }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/auth-pattern.svg)',
          opacity: 0.1,
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <StyledPaper elevation={0}>
          {illustration && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img 
                src={illustration} 
                alt="Auth illustration" 
                style={{ maxWidth: 200, height: 'auto' }}
              />
            </Box>
          )}
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              align="center" 
              color="textSecondary"
              sx={{ mb: 3 }}
            >
              {subtitle}
            </Typography>
          )}
          {children}
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default AuthLayout;