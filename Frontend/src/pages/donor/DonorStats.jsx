import React from 'react';
import { Grid, Card, CardContent, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Receipt as ReceiptIcon, Favorite as FavoriteIcon, TrendingUp as TrendingUpIcon, Money as MoneyIcon } from '@mui/icons-material';


const DonorStatsCard = ({ title, value, icon, color, loading, optimisticValue, subtitle }) => {
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
              {subtitle && (
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 0.5 }}>
                  {subtitle}
                </Typography>
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

const DonorStats = ({ stats, optimisticStats, loading, saving }) => {
  if (loading && !stats) {
    return <div>Loading stats...</div>;
  }
  
  if (!stats) {
    return null; 
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <DonorStatsCard
          title="Total Donations"
          value={stats?.totalDonations}
          optimisticValue={optimisticStats.totalDonations}
          icon={<ReceiptIcon />}
          color="#3498db"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DonorStatsCard
          title="Total Given"
          value={`₹${stats?.totalAmount?.toLocaleString('en-IN') || 0}`}
          optimisticValue={`₹${optimisticStats.totalAmount?.toLocaleString('en-IN') || 0}`}
          icon={<MoneyIcon />}
          color="#2ecc71"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DonorStatsCard
          title="Saved Campaigns"
          value={stats?.savedCampaigns}
          optimisticValue={optimisticStats.savedCampaigns}
          icon={<FavoriteIcon />}
          color="#e74c3c"
          loading={loading}
          subtitle={saving ? 'Updating...' : ''}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DonorStatsCard
          title="Impact Score"
          value={stats.impactScore || 0}
          optimisticValue={optimisticStats.impactScore || 0}
          icon={<TrendingUpIcon />}
          color="#9b59b6"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default DonorStats;
