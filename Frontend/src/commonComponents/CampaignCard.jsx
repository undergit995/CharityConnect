import React, { useState, useEffect, useCallback } from 'react';
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
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder,
  VolunteerActivism as DonateIcon,
  People,
  AccessTime,
  CalendarToday as CalendarIcon,
  LocationOn,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../Context/AuthContext';
import { api } from '../Services/authServices';
import { formatDistanceToNow, format } from 'date-fns';
import {
} from "@mui/material";


const CampaignCard = ({ campaign, onSave, isSaving }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(campaign.isSaved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  const isGoalReached = campaign.raisedAmount >= campaign.goalAmount;
  const progress = Math.min(
    ((campaign.raisedAmount || 0) / campaign.goalAmount) * 100,
    100
  );

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.endDate) - new Date()) /
        (1000 * 60 * 60 * 24)
    )
  );

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
    navigate(`/campaigns/${campaign._id}/donate`);
  };

  return ( 
  <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.02,
      }}
      transition={{ duration: 0.5 }}
    >
      <Box
        onClick={() => navigate(`/campaigns/${campaign._id}`)}
        sx={{
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          borderRadius: "32px",
          height: 500,
          boxShadow: isDark
            ? "0 30px 70px rgba(0,0,0,.45)"
            : "0 30px 60px rgba(0,0,0,.12)",
        }}
      >
        {/* Hero Image */}

        <motion.img
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.8 }}
          src={campaign.coverImage}
          alt={campaign.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
          }}
        />

        {/* Gradient */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
            linear-gradient(
            180deg,
            rgba(0,0,0,.05) 0%,
            rgba(0,0,0,.2) 35%,
            rgba(0,0,0,.88) 100%)
            `,
          }}
        />

        {/* Top Chips */}

        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Chip
            label={campaign.category}
            sx={{
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,.12)",
              color: "#fff",
              fontWeight: 700,
            }}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            {campaign.stats?.isVerified && (
              <Chip
                icon={<Verified />}
                label="Verified"
                sx={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(46,204,113,.25)",
                  color: "#fff",
                }}
              />
            )}

            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,.18)",
                backdropFilter: "blur(20px)",
              }}
            >
              <FavoriteBorder />
            </Avatar>
          </Box>
        </Box>

        {/* Bottom Overlay */}

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            backdropFilter: "blur(24px)",
            background: isDark
              ? "rgba(12,12,20,.30)"
              : "rgba(255,255,255,.15)",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 34,
              lineHeight: 1,
            }}
          >
            {campaign.title}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.85)",
              mt: 1,
              mb: 3,
              maxWidth: "90%",
            }}
          >
            {campaign.shortDescription}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 20,
              mb: 1.5,
              background: "rgba(255,255,255,.18)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 20,
                background:
                  "linear-gradient(90deg,#4F8CFF,#7367F0,#A855F7)",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "#fff",
              mb: 2,
            }}
          >
            <Typography fontWeight={700}>
              ₹
              {(campaign.raisedAmount || 0).toLocaleString()}
            </Typography>

            <Typography>
              Goal ₹
              {campaign.goalAmount.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" gap={2}>
              <Box display="flex" alignItems="center" gap={.5}>
                <LocationOn sx={{ color: "#fff", fontSize: 18 }} />
                <Typography color="#fff">
                  {campaign.location}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={.5}>
                <People sx={{ color: "#fff", fontSize: 18 }} />
                <Typography color="#fff">
                  {campaign.stats?.donorCount || 0}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={.5}>
              <AccessTime sx={{ color: "#fff", fontSize: 18 }} />
              <Typography color="#fff">
                {daysRemaining} Days
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
    );
};

export default CampaignCard;