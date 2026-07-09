// DonorSideBar.jsx - Fixed version

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  VolunteerActivism as DonateIcon,
  Campaign as CampaignIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const DonorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/donor/dashboard" },
    { text: "My Donations", icon: <ReceiptIcon />, path: "/donor/donations" },
    { text: "Saved Campaigns", icon: <FavoriteIcon />, path: "/donor/saved" },
    { text: "Explore Campaigns", icon: <SearchIcon />, path: "/donor/campaigns" },
    { text: "Profile", icon: <PersonIcon />, path: "/donor/profile" },
    { text: "Settings", icon: <SettingsIcon />, path: "/donor/settings" },
  ];

  const recentCampaigns = [
    { name: "Clean Water Initiative", progress: 75 },
    { name: "Education for All", progress: 60 },
    { name: "Medical Relief Fund", progress: 40 },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pt: 8,
      }}
    >
      {/* User Info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={user?.profileImage}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#2ecc71",
            }}
          >
            {user?.fullName?.charAt(0) || "D"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: isDark ? "#e8e8f0" : "#1a1a2e" }}
            >
              {user?.fullName || "Donor"}
            </Typography>
            <Chip
              label="Donor"
              size="small"
              sx={{
                backgroundColor: "rgba(46, 204, 113, 0.15)",
                color: "#2ecc71",
                fontWeight: 600,
                height: 20,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: isDark ? "#e8e8f0" : "#1a1a2e" }}
            >
              12
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
            >
              Donations
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: isDark ? "#e8e8f0" : "#1a1a2e" }}
            >
              2,450
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
            >
              Total Given
            </Typography>
          </Box>
        </Box>
        <Divider
          sx={{
            mt: 2,
            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        />
      </Box>

      {/* Menu */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive
                  ? isDark
                    ? "rgba(46, 204, 113, 0.15)"
                    : "rgba(46, 204, 113, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                },
                "& .MuiListItemIcon-root": {
                  color: isActive ? "#2ecc71" : isDark ? "#a0a0b8" : "#4a4a6a",
                  minWidth: 40,
                },
                "& .MuiListItemText-primary": {
                  color: isActive ? "#2ecc71" : isDark ? "#e8e8f0" : "#1a1a2e",
                  fontWeight: isActive ? 600 : 400,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>

      {/* Recent Campaigns - FIXED */}
      <Box sx={{ p: 2 }}>
        <Divider
          sx={{
            mb: 2,
            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        />
        <Typography
          variant="caption"
          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0", fontWeight: 600, px: 1, display: 'block' }}>RECENT CAMPAIGNS</Typography>
        {recentCampaigns.map((campaign, index) => (
          <ListItem
            secondaryAction={
              <Typography variant="caption" sx={{ color: isDark ? "#6a6a80" : "#9a9ab0", minWidth: "28px", textAlign: "right" }}>{campaign?.progress || 0}%</Typography>
            }
            key={index}
            sx={{
              borderRadius: 2,
              mt: 0.5,
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              },
            }}
          > 
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? "#e8e8f0" : "#1a1a2e",
                    fontWeight: 500,
                  }}
                >
                  {campaign?.name || "Untitled Campaign"}
                </Typography>
              }
              secondaryTypographyProps={{ component: 'div' }}
              secondary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{ width: `${campaign?.progress || 0}%`, height: "100%", backgroundColor: "#2ecc71", borderRadius: 2 }} />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Divider
          sx={{
            mb: 2,
            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        />
        <ListItem
          button
          onClick={logout}
          sx={{
            borderRadius: 2,
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            },
            "& .MuiListItemIcon-root": {
              color: "#e74c3c",
              minWidth: 40,
            },
            "& .MuiListItemText-primary": {
              color: "#e74c3c",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );
};

export default DonorSidebar;
