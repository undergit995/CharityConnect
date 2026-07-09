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
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../Services/authServices';
import { formatDistanceToNow } from 'date-fns';

export const CampaignCard = ({ campaign, onSave, isSaving, onDonate }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(campaign.isSaved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;
  const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (saveLoading) return;
    
    setSaveLoading(true);
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    try {
      await onSave(campaign._id, newSavedState);
    } catch (error) {
      setIsSaved(!newSavedState);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDonate = (e) => {
    e.stopPropagation();
    onDonate(campaign);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={() => navigate(`/campaigns/${campaign._id}`)}
        sx={{
          height: '100%',
          borderRadius: 3,
          cursor: 'pointer',
          background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
          },
        }}
      >
        {/* Progress Badge */}
        {progress >= 100 && (
          <Chip
            label="Goal Reached! 🎉"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 1,
              backgroundColor: 'rgba(46, 204, 113, 0.9)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        )}

        {/* Image */}
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={campaign.coverImage || '/images/campaign-placeholder.jpg'}
            alt={campaign.title}
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
            }}
          />
          <Chip
            label={campaign.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
          {campaign.isVerified && (
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
              label="Verified"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: 'rgba(46, 204, 113, 0.9)',
                color: '#fff',
                fontWeight: 600,
              }}
            />
          )}
          {daysRemaining > 0 && daysRemaining <= 7 && (
            <Chip
              label={`🔥 ${daysRemaining} days left`}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(231, 76, 60, 0.9)',
                color: '#fff',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDark ? '#e8e8f0' : '#1a1a2e',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {campaign.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: isDark ? '#a0a0b8' : '#4a4a6a',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 40,
            }}
          >
            {campaign.shortDescription || campaign.description}
          </Typography>

          {/* Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                ${(campaign.raisedAmount || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                ${(campaign.goalAmount || 0).toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                '& .MuiLinearProgress-bar': {
                  background: progress >= 100 
                    ? '#2ecc71'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon sx={{ fontSize: 14, color: isDark ? '#6a6a80' : '#9a9ab0' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                {campaign.stats?.donorCount || 0} donors
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 14, color: isDark ? '#6a6a80' : '#9a9ab0' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                {daysRemaining > 0 ? `${daysRemaining}d` : 'Expired'}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<DonateIcon />}
            onClick={handleDonate}
            disabled={campaign.status !== 'active' || daysRemaining <= 0}
            sx={{
              borderRadius: 2,
              flex: 1,
              background: campaign.status === 'active' && daysRemaining > 0
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              '&:hover': {
                background: campaign.status === 'active' && daysRemaining > 0
                  ? 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)'
                  : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              },
            }}
          >
            {campaign.status !== 'active' ? 'Inactive' : daysRemaining <= 0 ? 'Expired' : 'Donate'}
          </Button>
          <IconButton
            onClick={handleSaveToggle}
            disabled={saveLoading || isSaving}
            sx={{
              color: isSaved ? '#e74c3c' : isDark ? '#a0a0b8' : '#4a4a6a',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </CardActions>
      </Card>
    </motion.div>
  );
};