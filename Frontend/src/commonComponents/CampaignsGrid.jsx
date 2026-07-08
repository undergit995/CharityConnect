import React, { useState } from 'react';
import { Grid, Card, CardContent, Box, Typography, IconButton, Chip, LinearProgress, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  VolunteerActivism as DonateIcon,
} from '@mui/icons-material';

// Campaign Card with Optimistic Updates
const CampaignCard = ({ campaign, onSave, isSaving }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(campaign.isSaved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (saveLoading) return;
    
    setSaveLoading(true);
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    try {
      await onSave(campaign._id, newSavedState);
    } catch (error) {
      // Rollback on error
      setIsSaved(!newSavedState);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
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
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={campaign.coverImage || '/images/campaign-placeholder.jpg'}
            alt={campaign.title}
            sx={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
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
                right: 12,
                backgroundColor: 'rgba(46, 204, 113, 0.9)',
                color: '#fff',
                fontWeight: 600,
              }}
            />
          )}
          <IconButton
            onClick={handleSaveToggle}
            disabled={saveLoading || isSaving}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,1)',
              },
            }}
          >
            {isSaved ? (
              <FavoriteIcon sx={{ color: '#e74c3c' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: isDark ? '#fff' : '#1a1a2e' }} />
            )}
          </IconButton>
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
            }}
          >
            {campaign.shortDescription || campaign.description}
          </Typography>

          {/* ... (rest of the card content is the same) */}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          {/* ... (button is the same) */}
        </CardActions>
      </Card>
    </motion.div>
  );
};

const CampaignsGrid = ({ campaigns, onSave, isSaving }) => (
  <Grid container spacing={3}>
    {campaigns.map((campaign) => (
      <Grid item xs={12} sm={6} md={4} key={campaign._id}>
        <CampaignCard campaign={campaign} onSave={onSave} isSaving={isSaving} />
      </Grid>
    ))}
  </Grid>
);

export default CampaignsGrid;