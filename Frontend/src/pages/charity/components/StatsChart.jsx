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


const StatsCard = ({
  title,
  value,
  icon,
  color,
  trend,
  percentage,
  subtitle,
  loading,
}) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          background: isDark ? "rgba(20,20,32,0.8)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.3)"
              : "0 8px 40px rgba(0,0,0,0.08)",
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "#a0a0b8" : "#4a4a6a",
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
                    color: isDark ? "#e8e8f0" : "#1a1a2e",
                    mb: 0.5,
                  }}
                >
                  {value}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                >
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  {trend === "up" ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: "#2ecc71" }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: "#e74c3c" }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: trend === "up" ? "#2ecc71" : "#e74c3c",
                      fontWeight: 600,
                    }}
                  >
                    {percentage}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                  >
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

export default StatsCard;