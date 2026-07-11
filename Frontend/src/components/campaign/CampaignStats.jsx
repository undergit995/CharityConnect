import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as GoalReachedIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';

const CampaignStats = ({ campaign }) => {
  const { isDark } = useTheme();

  if (!campaign) return null;

  const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;
  const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isGoalReached = campaign.raisedAmount >= campaign.goalAmount;
  const exceededBy = campaign.raisedAmount > campaign.goalAmount ? 
    campaign.raisedAmount - campaign.goalAmount : 0;

  return (
    <Box>
      {/* Goal Status */}
      {isGoalReached && (
        <Chip
          icon={<GoalReachedIcon />}
          label={`🎉 Goal Reached! ${exceededBy > 0 ? `+$${exceededBy.toLocaleString()} over goal` : ''}`}
          sx={{
            mb: 2,
            backgroundColor: 'rgba(46, 204, 113, 0.15)',
            color: '#2ecc71',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#2ecc71',
            },
          }}
        />
      )}

      {/* Progress */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
            ${campaign.raisedAmount?.toLocaleString() || 0}
          </Typography>
          <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
            ${campaign.goalAmount?.toLocaleString() || 0}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            '& .MuiLinearProgress-bar': {
              background: progress >= 100 
                ? '#2ecc71'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 4,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {isGoalReached ? '🎯 Goal Reached!' : `${Math.round(progress)}% funded`}
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {campaign.stats?.donorCount || 0} donors
          </Typography>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              <PeopleIcon sx={{ fontSize: 14, mr: 0.5 }} />
              Donors
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {campaign.stats?.donorCount || 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
              Days Left
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {daysRemaining > 0 ? daysRemaining : 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              {isGoalReached ? '🎉 Goal' : 'Progress'}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {isGoalReached ? 'Reached!' : `${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Over Goal Message */}
      {exceededBy > 0 && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: '#2ecc71',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          ✨ ${exceededBy.toLocaleString()} raised beyond goal!
        </Typography>
      )}

      {/* Verified Badge */}
      {campaign.isVerified && (
        <Chip
          label="Verified"
          size="small"
          sx={{
            mt: 2,
            backgroundColor: 'rgba(46, 204, 113, 0.15)',
            color: '#2ecc71',
          }}
        />
      )}
    </Box>
  );
};

export default CampaignStats;