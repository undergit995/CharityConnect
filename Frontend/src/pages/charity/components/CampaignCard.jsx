import React, { useState, useEffect } from "react";
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
  Stack,
  useMediaQuery,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../../../hooks/useTheme";

const CampaignStatusCard = ({ status, count, color, icon, loading }) => {
  const { isDark } = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
            >
              {status}
            </Typography>
            {loading ? (
              <CircularProgress size={16} />
            ) : (
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: isDark ? "#e8e8f0" : "#1a1a2e" }}
              >
                {count}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignStatusCard;