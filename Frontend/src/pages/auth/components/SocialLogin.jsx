import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { 
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from '@mui/icons-material';

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    // Handle social login
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Box>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={() => handleSocialLogin('google')}
        sx={{
          mb: 1,
          py: 1.5,
          borderColor: 'grey.300',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
          }
        }}
      >
        Continue with Google
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<FacebookIcon />}
        onClick={() => handleSocialLogin('facebook')}
        sx={{
          mb: 1,
          py: 1.5,
          borderColor: 'grey.300',
          '&:hover': {
            borderColor: '#1877f2',
            bgcolor: 'rgba(24, 119, 242, 0.05)',
          }
        }}
      >
        Continue with Facebook
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AppleIcon />}
        onClick={() => handleSocialLogin('apple')}
        sx={{
          py: 1.5,
          borderColor: 'grey.300',
          '&:hover': {
            borderColor: 'black',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
          }
        }}
      >
        Continue with Apple
      </Button>
    </Box>
  );
};

export default SocialLogin;