import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useMediaQuery,
  Badge,
  Stack,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../Context/AuthContext";
import OTPInput from "../auth/components/OTPInput";
import { api } from "../../Services/authServices";

const AdminProfile = () => {
  const { isDark } = useTheme();
  const { user, updateCurrentUser, sendOTP, verifyOTP } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCharities: 0,
    totalCampaigns: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailChangeToken, setEmailChangeToken] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  console.log(user);
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "India",
        zipCode: user.address?.zipCode || "",
        notifications: user.notificationPreferences || {
          email: true,
          push: true,
          sms: false,
        },
      });
      if (user.profileImage) {
        setPreviewUrl(user.profileImage);
      }
    }
  }, [user]);

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await api.get("/admin/dashboard/stats");
        if (response.data.success) {
          setStats(response.data.data.stats);
        }
      } catch (err) {
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChangeRequest = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      const result = await sendOTP(formData.email, "email-change");
      if (result.success) {
        setOtpDialogOpen(true);
      } else {
        setError(result.message || "Failed to send OTP to new email.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while sending OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyEmailAndSave = useCallback(
    async (otp) => {
      if (otp.length !== 6) return;
      setOtpLoading(true);
      setOtpError("");
      try {
        setEmailChangeToken(otp);
        setOtpDialogOpen(false);
        setTimeout(() => {
          document.getElementById("profile-update-form-submit-button").click();
        }, 100);
      } catch (err) {
        setOtpError(err.message || "Invalid OTP");
      } finally {
        setOtpLoading(false);
      }
    },
    [formData.email, verifyOTP],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.email !== user.email && !emailChangeToken) {
      handleEmailChangeRequest();
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value && typeof value === "object") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      if (profileImage instanceof File) {
        formDataToSend.append("profileImage", profileImage);
      }

      if (emailChangeToken) {
        formDataToSend.append("emailChangeToken", emailChangeToken);
      }

      await api.put("/admin/profile", formDataToSend);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      await updateCurrentUser();
      setEmailChangeToken("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "India",
        zipCode: user.address?.zipCode || "",
        notifications: user.notificationPreferences || {
          email: true,
          push: true,
          sms: false,
        },
      });
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <Card
      sx={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ backgroundColor: `${color}20`, color: color }}>
            {icon}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: isDark ? "#e8e8f0" : "#1a1a2e" }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#e8e8f0" : "#1a1a2e",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                Admin Profile
                <Chip
                  icon={<AdminIcon sx={{ fontSize: 16 }} />}
                  label="Admin"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(102, 126, 234, 0.15)",
                    color: "#667eea",
                    fontWeight: 600,
                  }}
                />
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
              >
                Manage your administrator profile settings
              </Typography>
            </Box>
            <Button
              variant={isEditing ? "outlined" : "contained"}
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              sx={{
                borderRadius: 2,
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              }}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </Box>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: isDark ? "rgba(20,20,32,0.8)" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              mb: 4,
            }}
          >
            <Grid container spacing={4}>
              {/* Avatar Section */}
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      isEditing && (
                        <IconButton
                          component="label"
                          sx={{
                            backgroundColor: "#667eea",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#5a67d8" },
                            width: 36,
                            height: 36,
                          }}
                        >
                          <PhotoCameraIcon sx={{ fontSize: 18 }} />
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                          />
                        </IconButton>
                      )
                    }
                  >
                    <Avatar
                      src={previewUrl}
                      sx={{
                        width: 150,
                        height: 150,
                        border: `4px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                        backgroundColor: "#667eea",
                        fontSize: 48,
                      }}
                    >
                      {!previewUrl && (user?.firstName?.charAt(0) || "A")}
                    </Avatar>
                  </Badge>
                  {user?.emailVerified && (
                    <VerifiedIcon
                      sx={{
                        position: "absolute",
                        bottom: 20,
                        right: 10,
                        color: "#2ecc71",
                        fontSize: 24,
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    color: isDark ? "#e8e8f0" : "#1a1a2e",
                  }}
                >
                  {user?.fullName || "Admin"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
                >
                  {user?.email}
                </Typography>
                <Chip
                  icon={<AdminIcon sx={{ fontSize: 14 }} />}
                  label="Administrator"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: "rgba(102, 126, 234, 0.15)",
                    color: "#667eea",
                    fontWeight: 600,
                  }}
                />
              </Grid>

              {/* Profile Info */}
              <Grid item xs={12} md={9}>
                <form onSubmit={handleSubmit} id="profile-update-form">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(0,0,0,0.02)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(0,0,0,0.02)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(0,0,0,0.02)",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <EmailIcon
                              sx={{
                                mr: 1,
                                color: isDark ? "#6a6a80" : "#9a9ab0",
                              }}
                            />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(0,0,0,0.02)",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon
                              sx={{
                                mr: 1,
                                color: isDark ? "#6a6a80" : "#9a9ab0",
                              }}
                            />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(0,0,0,0.02)",
                          },
                        }}
                      />
                    </Grid>
                    {isEditing && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="outlined"
                            id="profile-update-form-submit-button"
                            onClick={handleCancel}
                            sx={{ borderRadius: 2 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={
                              loading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SaveIcon />
                              )
                            }
                            sx={{
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)",
                              },
                            }}
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <Dialog
          open={otpDialogOpen}
          onClose={() => setOtpDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Verify New Email Address</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              We've sent a verification code to{" "}
              <strong>{formData.email}</strong>. Please enter it below to
              confirm the change.
            </Typography>
            {otpError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {otpError}
              </Alert>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <OTPInput
                length={6}
                onComplete={handleVerifyEmailAndSave}
                disabled={otpLoading}
              />
            </Box>
            {otpLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2">Verifying...</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                const otpInputs = document.querySelectorAll(
                  'input[aria-label="Please enter verification code"]',
                );
                const otpValue = Array.from(otpInputs)
                  .map((input) => input.value)
                  .join("");
                handleVerifyEmailAndSave(otpValue);
              }}
              variant="contained"
              disabled={otpLoading}
            >
              Verify & Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PersonIcon />}
              label="Total Users"
              value={
                statsLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.totalUsers?.toLocaleString() || "0"
                )
              }
              color="#3498db"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<BusinessIcon />}
              label="Total Charities"
              value={
                statsLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.totalCharities?.toLocaleString() || "0"
                )
              }
              color="#9b59b6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<LanguageIcon />}
              label="Total Campaigns"
              value={
                statsLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.totalCampaigns?.toLocaleString() || "0"
                )
              }
              color="#2ecc71"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<DateRangeIcon />}
              label="Member Since"
              value={
                user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"
              }
              color="#f39c12"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminProfile;
