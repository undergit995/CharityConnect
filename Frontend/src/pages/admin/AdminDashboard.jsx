import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useMediaQuery,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People as PeopleIcon,
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  Business as CharityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend, percentage, subtitle }) => {
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

// Recent Activity Item
const ActivityItem = ({ activity }) => {
  const { isDark } = useTheme();

  const getIcon = (type) => {
    switch (type) {
      case 'donation': return <DonateIcon />;
      case 'campaign': return <CampaignIcon />;
      case 'charity': return <CharityIcon />;
      case 'user': return <PeopleIcon />;
      default: return <PeopleIcon />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'donation': return '#2ecc71';
      case 'campaign': return '#3498db';
      case 'charity': return '#9b59b6';
      case 'user': return '#f39c12';
      default: return '#667eea';
    }
  };

  return (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        },
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ backgroundColor: `${getColor(activity.type)}15`, color: getColor(activity.type) }}>
          {getIcon(activity.type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
            {activity.message}
          </Typography>
        }
        secondary={
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {activity.time}
          </Typography>
        }
      />
      <Chip
        label={activity.status}
        size="small"
        sx={{
          backgroundColor: activity.status === 'Completed' 
            ? 'rgba(46, 204, 113, 0.15)' 
            : activity.status === 'Pending'
            ? 'rgba(243, 156, 18, 0.15)'
            : 'rgba(231, 76, 60, 0.15)',
          color: activity.status === 'Completed' 
            ? '#2ecc71' 
            : activity.status === 'Pending'
            ? '#f39c12'
            : '#e74c3c',
          fontWeight: 500,
        }}
      />
    </ListItem>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Stats Data
  const stats = [
    {
      title: 'Total Donors',
      value: '12,847',
      icon: <PeopleIcon />,
      color: '#3498db',
      trend: 'up',
      percentage: 12,
      subtitle: '+234 this month',
    },
    {
      title: 'Total Campaigns',
      value: '1,243',
      icon: <CampaignIcon />,
      color: '#2ecc71',
      trend: 'up',
      percentage: 8,
      subtitle: '+45 this month',
    },
    {
      title: 'Total Donations',
      value: '$2.4M',
      icon: <DonateIcon />,
      color: '#f39c12',
      trend: 'up',
      percentage: 15,
      subtitle: '+$120K this month',
    },
    {
      title: 'Active Charities',
      value: '487',
      icon: <CharityIcon />,
      color: '#9b59b6',
      trend: 'down',
      percentage: 3,
      subtitle: '-12 this month',
    },
  ];

  // Recent Donations Data
  const recentDonations = [
    { id: 1, donor: 'John Doe', amount: '$5,000', campaign: 'Clean Water Initiative', date: '2024-01-15', status: 'Completed' },
    { id: 2, donor: 'Sarah Smith', amount: '$2,500', campaign: 'Education for All', date: '2024-01-14', status: 'Pending' },
    { id: 3, donor: 'Mike Johnson', amount: '$1,000', campaign: 'Food Security', date: '2024-01-13', status: 'Completed' },
    { id: 4, donor: 'Emily Brown', amount: '$7,500', campaign: 'Medical Relief', date: '2024-01-12', status: 'Failed' },
  ];

  // Pending Approvals
  const pendingApprovals = [
    { id: 1, name: 'Hope Foundation', type: 'Charity', date: '2024-01-15', status: 'Pending' },
    { id: 2, name: 'Clean Water Campaign', type: 'Campaign', date: '2024-01-14', status: 'Pending' },
    { id: 3, name: 'Education Initiative', type: 'Campaign', date: '2024-01-13', status: 'Pending' },
    { id: 4, name: 'Save the Children', type: 'Charity', date: '2024-01-12', status: 'Pending' },
  ];

  // Recent Activity
  const recentActivity = [
    { id: 1, message: 'New donation of $5,000 from John Doe', time: '5 min ago', type: 'donation', status: 'Completed' },
    { id: 2, message: 'Charity "Hope Foundation" registered', time: '15 min ago', type: 'charity', status: 'Pending' },
    { id: 3, message: 'Campaign "Clean Water" approved', time: '1 hour ago', type: 'campaign', status: 'Completed' },
    { id: 4, message: 'New donor Sarah Smith registered', time: '2 hours ago', type: 'user', status: 'Completed' },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

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
              Welcome back, {user?.fullName || 'Admin'}
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Here's what's happening with your platform today
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
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
            <Tooltip title="Export Data">
              <IconButton
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                '&.Mui-selected': {
                  color: '#667eea',
                },
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Donations" />
            <Tab label="Charities" />
            <Tab label="Campaigns" />
          </Tabs>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Recent Donations */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                borderRadius: 3,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Recent Donations
                </Typography>
                <Button
                  size="small"
                  sx={{ color: '#667eea' }}
                  onClick={() => navigate('/admin/donations')}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Donor</TableCell>
                      <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Amount</TableCell>
                      <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Campaign</TableCell>
                      <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Status</TableCell>
                      <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>{donation.donor}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {donation.amount}
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>{donation.campaign}</TableCell>
                        <TableCell>
                          <Chip
                            label={donation.status}
                            size="small"
                            sx={{
                              backgroundColor: donation.status === 'Completed' 
                                ? 'rgba(46, 204, 113, 0.15)' 
                                : donation.status === 'Pending'
                                ? 'rgba(243, 156, 18, 0.15)'
                                : 'rgba(231, 76, 60, 0.15)',
                              color: donation.status === 'Completed' 
                                ? '#2ecc71' 
                                : donation.status === 'Pending'
                                ? '#f39c12'
                                : '#e74c3c',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Pending Approvals & Activity */}
          <Grid item xs={12} md={4}>
            {/* Pending Approvals */}
            <Paper
              sx={{
                borderRadius: 3,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                mb: 3,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Pending Approvals
                </Typography>
                <Chip
                  label={pendingApprovals.length}
                  size="small"
                  sx={{
                    backgroundColor: '#f39c12',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
              <List sx={{ p: 1 }}>
                {pendingApprovals.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                          {item.type} • {item.date}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          sx={{
                            color: '#2ecc71',
                            '&:hover': { backgroundColor: 'rgba(46, 204, 113, 0.1)' },
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          sx={{
                            color: '#e74c3c',
                            '&:hover': { backgroundColor: 'rgba(231, 76, 60, 0.1)' },
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Recent Activity */}
            <Paper
              sx={{
                borderRadius: 3,
                background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Recent Activity
                </Typography>
              </Box>
              <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
              <List sx={{ p: 1 }}>
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* CSS Animation */}
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