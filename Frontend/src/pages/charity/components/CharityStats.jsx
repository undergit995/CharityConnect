import React from 'react';
import { Grid, Card, CardContent, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../../hooks/useTheme';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  VolunteerActivism as DonateIcon,
} from '@mui/icons-material';

// Stats Card with Optimistic Updates
const StatsCard = ({ title, value, icon, color, trend, percentage, loading, optimisticValue }) => {
  const { isDark } = useTheme();
  const displayValue = optimisticValue !== undefined ? optimisticValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', fontWeight: 500, mb: 1 }}
              >
                {title}
              </Typography>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  {displayValue}
                </Typography>
              )}
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  {trend === 'up' ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: '#2ecc71' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: '#e74c3c' }} />
                  )}
                  <Typography variant="caption" sx={{ color: trend === 'up' ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>
                    {percentage}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar sx={{ width: 48, height: 48, backgroundColor: `${color}15`, color: color }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CharityStats = ({ stats, optimisticStats, loading }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md>
        <StatsCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          optimisticValue={optimisticStats.totalCampaigns}
          icon={<CampaignIcon />}
          color="#3498db"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md>
        <StatsCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          optimisticValue={optimisticStats.activeCampaigns}
          icon={<TrendingUpIcon />}
          color="#2ecc71"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md>
        <StatsCard
          title="Total Donations"
          value={stats.totalDonations}
          optimisticValue={optimisticStats.totalDonations}
          icon={<DonateIcon />}
          color="#9b59b6"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md>
        <StatsCard
          title="Total Raised"
          value={`₹${stats.totalRaised?.toLocaleString() || 0}`}
          optimisticValue={`₹${optimisticStats.totalRaised?.toLocaleString() || 0}`}
          icon={"₹"}
          color="#f39c12"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md>
        <StatsCard
          title="Total Donors"
          value={stats.totalDonors}
          optimisticValue={optimisticStats.totalDonors}
          icon={<PeopleIcon />}
          color="#e74c3c"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default CharityStats;