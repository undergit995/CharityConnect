import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  Business as CharityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend, percentage, subtitle, loading }) => {
  const { isDark } = useTheme();

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
            boxShadow: isDark
              ? '0 8px 40px rgba(0,0,0,0.3)'
              : '0 8px 40px rgba(0,0,0,0.08)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 0.5,
                  }}
                >
                  {value}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  {trend === 'up' ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: '#2ecc71' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: '#e74c3c' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: trend === 'up' ? '#2ecc71' : '#e74c3c',
                      fontWeight: 600,
                    }}
                  >
                    {percentage}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    vs last month
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [period, setPeriod] = useState('month');
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/dashboard/stats', {
        params: { period }
      });
      
      if (response.data.success) {
        const { stats, charts, recent } = response.data.data;
        setStats(stats);
        setCharts(charts);
        setRecentData(recent);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  // Prepare chart data
  const prepareDonationTrendData = () => {
    if (!charts?.donationTrend) return [];
    return charts.donationTrend.labels.map((label, index) => ({
      name: label,
      amount: charts.donationTrend.amounts[index] || 0,
      count: charts.donationTrend.counts[index] || 0,
    }));
  };

  const prepareCategoryData = () => {
    if (!charts?.categoryDistribution) return [];
    return charts.categoryDistribution.labels.map((label, index) => ({
      name: label,
      value: charts.categoryDistribution.counts[index] || 0,
      raised: charts.categoryDistribution.raised[index] || 0,
    }));
  };

  const prepareMonthlyData = () => {
    if (!charts?.monthlyDonations) return [];
    return charts.monthlyDonations.labels.map((label, index) => ({
      name: label,
      amount: charts.monthlyDonations.amounts[index] || 0,
      count: charts.monthlyDonations.counts[index] || 0,
    }));
  };

  const prepareTopCharitiesData = () => {
    if (!charts?.topCharities) return [];
    return charts.topCharities.map(item => ({
      name: item.name,
      amount: item.totalAmount,
    }));
  };

  const prepareTopCampaignsData = () => {
    if (!charts?.topCampaigns) return [];
    return charts.topCampaigns.map(item => ({
      name: item.name,
      amount: item.totalAmount,
      progress: item.progress,
    }));
  };

  const COLORS = ['#667eea', '#764ba2', '#2ecc71', '#f39c12', '#e74c3c', '#3498db', '#1abc9c', '#9b59b6', '#e67e22', '#95a5a6'];

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchDashboardData} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0a0a12' : '#f8f9fa',
        transition: 'background-color 0.3s ease',
        pt: 0,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 3, pb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 0.5,
              }}
            >
              Welcome back, {user?.fullName || 'Admin'} 👋
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Here's what's happening with your platform today
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Period Filter */}
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ borderRadius: 2 }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => { setPeriod('day'); setAnchorEl(null); }}>Day</MenuItem>
              <MenuItem onClick={() => { setPeriod('week'); setAnchorEl(null); }}>Week</MenuItem>
              <MenuItem onClick={() => { setPeriod('month'); setAnchorEl(null); }}>Month</MenuItem>
              <MenuItem onClick={() => { setPeriod('year'); setAnchorEl(null); }}>Year</MenuItem>
            </Menu>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchDashboardData}
                disabled={loading}
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <RefreshIcon sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Donors"
              value={stats?.totalUsers?.toLocaleString() || '0'}
              icon={<PeopleIcon />}
              color="#3498db"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Campaigns"
              value={stats?.totalCampaigns?.toLocaleString() || '0'}
              icon={<CampaignIcon />}
              color="#2ecc71"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Donations"
              value={`₹${stats?.totalAmount?.toLocaleString('en-IN') || '0'}`}
              icon={<DonateIcon />}
              color="#f39c12"
              trend={stats?.donationGrowth > 0 ? 'up' : 'down'}
              percentage={Math.abs(stats?.donationGrowth || 0)}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Charities"
              value={stats?.totalCharities?.toLocaleString() || '0'}
              icon={<CharityIcon />}
              color="#9b59b6"
              subtitle={`${stats?.pendingCharities || 0} pending approval`}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        {!loading && charts && (
          <>
            {/* Donation Trend */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                Donation Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareDonationTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a3e' : '#e0e0e0'} />
                  <XAxis dataKey="name" stroke={isDark ? '#a0a0b8' : '#4a4a6a'} />
                  <YAxis stroke={isDark ? '#a0a0b8' : '#4a4a6a'} />
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#667eea" strokeWidth={2} name="Amount (₹)" />
                  <Line type="monotone" dataKey="count" stroke="#2ecc71" strokeWidth={2} name="Donations" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            {/* Category Distribution & Monthly Donations */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{xs:12 , md:6}}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    Campaign Categories
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareCategoryData()}
                        cx="50%"
                        cy={isMobile ? '40%' : '50%'}
                        labelLine={false}
                        label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                          borderRadius: 8,
                        }}
                      />
                      <Legend layout={isMobile ? 'horizontal' : 'bottom'} verticalAlign={isMobile ? 'bottom' : 'middle'} align={isMobile ? 'center' : 'right'} />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid size={{xs:12 , md:6}}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    Monthly Donations
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareMonthlyData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a3e' : '#e0e0e0'} />
                      <XAxis dataKey="name" stroke={isDark ? '#a0a0b8' : '#4a4a6a'} />
                      <YAxis stroke={isDark ? '#a0a0b8' : '#4a4a6a'} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="amount" fill="#667eea" name="Amount (₹)" barSize={20} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Top Charities & Top Campaigns */}
            <Grid container spacing={3}>
              <Grid size={{xs:12 , md:6}}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    Top Charities
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareTopCharitiesData()}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a3e' : '#e0e0e0'} />
                      <XAxis type="number" stroke={isDark ? '#a0a0b8' : '#4a4a6a'} />
                      <YAxis dataKey="name" type="category" stroke={isDark ? '#a0a0b8' : '#4a4a6a'} width={100} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="amount" fill="#9b59b6" name="Total Raised (₹)" barSize={20} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid size={{xs:12 , md:6}}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    Top Campaigns
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareTopCampaignsData()}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a3e' : '#e0e0e0'} />
                      <XAxis type="number" stroke={isDark ? '#a0a0b8' : '#4a4a6a'} />
                      <YAxis dataKey="name" type="category" stroke={isDark ? '#a0a0b8' : '#4a4a6a'} width={100} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="amount" fill="#2ecc71" name="Total Raised (₹)" barSize={20} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default AdminDashboard;