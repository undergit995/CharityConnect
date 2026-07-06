import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak', color: 'error' };
      case 2:
      case 3:
        return { label: 'Medium', color: 'warning' };
      case 4:
        return { label: 'Strong', color: 'info' };
      case 5:
        return { label: 'Very Strong', color: 'success' };
      default:
        return { label: 'Weak', color: 'error' };
    }
  };

  const score = getStrength(password);
  const { label, color } = getStrengthLabel(score);
  const value = (score / 5) * 100;

  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains number', met: /[0-9]/.test(password) },
    { text: 'Contains special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="textSecondary">
          Password Strength
        </Typography>
        <Typography variant="caption" color={`${color}.main`} fontWeight={600}>
          {label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
      />
      <Box sx={{ mt: 1 }}>
        {requirements.map((req, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {req.met ? (
              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <Cancel sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography variant="caption" color={req.met ? 'success.main' : 'textSecondary'}>
              {req.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PasswordStrength;