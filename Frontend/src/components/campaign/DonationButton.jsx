import React, { useState } from 'react';
import { Button, Tooltip, Box, Chip } from '@mui/material';
import { VolunteerActivism as DonateIcon, EmojiEvents as GoalReachedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const DonationButton = ({ campaign, onClick }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {

    onClick?.();
  };

  const isActive = campaign.status === 'active' && 
                   !campaign.isExpired && 
                   campaign.isActive;

  const isGoalReached = campaign.raisedAmount >= campaign.goalAmount;

  return (
    <Box>
      <Tooltip title={
        !isActive ? 'Campaign is not active' : 
        isGoalReached ? 'Goal reached! You can still donate to support further' :
        'Make a donation'
      }>
        <span style={{ width: '100%' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleClick}
            disabled={!isActive}
            startIcon={<DonateIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 700,
              background: isActive 
                ? isGoalReached
                  ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(0,0,0,0.05)',
              '&:hover': {
                background: isActive 
                  ? isGoalReached
                    ? 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)'
                    : 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)'
                  : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            {!isActive 
              ? campaign.isExpired ? 'Campaign Expired' : 'Inactive'
              : isGoalReached
                ? '🌟 Donate to Support Further'
                : 'Donate Now'
            }
          </Button>
        </span>
      </Tooltip>

      {isGoalReached && isActive && (
        <Chip
          icon={<GoalReachedIcon />}
          label="Goal Reached! Every extra dollar helps make a bigger impact"
          size="small"
          sx={{
            mt: 1,
            width: '100%',
            backgroundColor: 'rgba(46, 204, 113, 0.15)',
            color: '#2ecc71',
            '& .MuiChip-icon': {
              color: '#2ecc71',
            },
          }}
        />
      )}
    </Box>
  );
};

export default DonationButton;