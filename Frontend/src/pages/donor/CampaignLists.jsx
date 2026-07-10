import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
  Drawer,
  useMediaQuery,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  VolunteerActivism as DonateIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { formatDistanceToNow } from 'date-fns';
import { CampaignCard } from './CampaignCard';



// Filter Drawer
const FilterDrawer = ({ open, onClose, filters, onApply, onReset }) => {
  const { isDark } = useTheme();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const categories = [
    'Medical', 'Education', 'Food', 'Disaster Relief',
    'Animal Welfare', 'Children', 'Women', 'Elderly',
    'Environment', 'Community', 'Other'
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'ending', label: 'Ending Soon' },
    { value: 'goal', label: 'Lowest Goal' },
    { value: 'raised', label: 'Highest Raised' },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          p: 3,
          background: isDark ? 'rgba(10,10,18,0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Sort */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Sort By
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select
          value={localFilters.sort}
          onChange={(e) => setLocalFilters({ ...localFilters, sort: e.target.value })}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Categories */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Categories
      </Typography>
      <FormGroup sx={{ mb: 3, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }}>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                size="small"
                checked={localFilters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...localFilters.categories, category]
                    : localFilters.categories.filter(c => c !== category);
                  setLocalFilters({ ...localFilters, categories: newCategories });
                }}
              />
            }
            label={category}
            sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
          />
        ))}
      </FormGroup>

      {/* Amount Range */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Goal Amount Range
      </Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={[localFilters.minGoal || 0, localFilters.maxGoal || 1000000]}
          onChange={(e, newValue) => {
            setLocalFilters({ ...localFilters, minGoal: newValue[0], maxGoal: newValue[1] });
          }}
          valueLabelDisplay="auto"
          min={0}
          max={1000000}
          step={1000}
          valueLabelFormat={(value) => `$${value.toLocaleString()}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            ${(localFilters.minGoal || 0).toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            ${(localFilters.maxGoal || 1000000).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Status */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Status
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={localFilters.showActive}
              onChange={(e) => setLocalFilters({ ...localFilters, showActive: e.target.checked })}
            />
          }
          label="Active Campaigns"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={localFilters.showUrgent}
              onChange={(e) => setLocalFilters({ ...localFilters, showUrgent: e.target.checked })}
            />
          }
          label="Urgent (Ending in 7 days)"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={localFilters.showCompleted}
              onChange={(e) => setLocalFilters({ ...localFilters, showCompleted: e.target.checked })}
            />
          }
          label="Completed Campaigns"
        />
      </FormGroup>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onReset}
          startIcon={<ClearIcon />}
          sx={{ borderRadius: 2 }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onApply(localFilters)}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};

// Main Campaign List Component
const CampaignList = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const [filters, setFilters] = useState({
    sort: 'recent',
    categories: [],
    minGoal: 0,
    maxGoal: 1000000,
    showActive: true,
    showUrgent: false,
    showCompleted: false,
  });

  // Fetch campaigns
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 12,
        search: searchTerm,
        sort: filters.sort,
        categories: filters.categories.join(','),
        minGoal: filters.minGoal,
        maxGoal: filters.maxGoal,
        showActive: filters.showActive,
        showUrgent: filters.showUrgent,
        showCompleted: filters.showCompleted,
      };

      const response = await api.get('/campaigns', { params });
      setCampaigns(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalCampaigns(response.data.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filters]);

  // Handle save campaign
  const handleSaveCampaign = useCallback(async (campaignId, isSaved) => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setSaving(true);
    try {
      await api.post(`/campaigns/${campaignId}/save`, { saved: isSaved });
      
      // Update local state
      setCampaigns(prev =>
        prev.map(c =>
          c._id === campaignId
            ? { ...c, isSaved: isSaved }
            : c
        )
      );
      
      setSuccess(isSaved ? 'Campaign saved!' : 'Campaign removed from saved');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to save campaign');
      setSnackbarOpen(true);
      // Revert
      setCampaigns(prev =>
        prev.map(c =>
          c._id === campaignId
            ? { ...c, isSaved: !isSaved }
            : c
        )
      );
    } finally {
      setSaving(false);
    }
  }, [isAuthenticated, navigate]);

  // Handle donate
  const handleDonate = (campaign) => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    navigate(`/donor/campaigns/${campaign._id}/donate`);
  };

  // Apply filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setFilterDrawerOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      sort: 'recent',
      categories: [],
      minGoal: 0,
      maxGoal: 1000000,
      showActive: true,
      showUrgent: false,
      showCompleted: false,
    });
    setPage(1);
    setFilterDrawerOpen(false);
  };

  // Initial load
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCampaigns();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchCampaigns]);

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                Explore Campaigns
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                {totalCampaigns} campaigns found • Make a difference today
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchCampaigns}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  borderRadius: 2,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                }}
              >
                Filters
                {(filters.categories.length > 0 || filters.showUrgent) && (
                  <Chip
                    label={filters.categories.length + (filters.showUrgent ? 1 : 0)}
                    size="small"
                    sx={{
                      ml: 1,
                      backgroundColor: '#667eea',
                      color: '#fff',
                      height: 18,
                      '& .MuiChip-label': { fontSize: '0.6rem', px: 1 },
                    }}
                  />
                )}
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Search Bar */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search campaigns by title, category, or charity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Error/Success */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Campaigns Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : campaigns.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Typography variant="h6" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', mb: 1 }}>
              No Campaigns Found
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Try adjusting your search or filters to find campaigns.
            </Typography>
            <Button
              variant="contained"
              onClick={handleResetFilters}
              sx={{
                mt: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Reset Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {campaigns.map((campaign) => (
              <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                <CampaignCard
                  campaign={campaign}
                  onSave={handleSaveCampaign}
                  isSaving={saving}
                  onDonate={handleDonate}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {campaigns.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size={isMobile ? 'small' : 'large'}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                },
              }}
            />
          </Box>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          filters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            severity={error ? 'error' : 'success'} 
            onClose={() => setSnackbarOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CampaignList;