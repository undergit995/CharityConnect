// pages/admin/AdminCharityApproval.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Pagination,
  CircularProgress,
  Alert,
  Divider,
  Tab,
  Tabs,
  useMediaQuery,
  Stack,
  Rating,
} from "@mui/material";
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Pending as PendingIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../Services/authServices";
import { formatDistanceToNow } from "date-fns";

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const AdminCharityApproval = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const itemsPerPage = 10;

  // Fetch charities
  const fetchCharities = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/charities", {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          status:
            tabValue === 0
              ? "pending"
              : tabValue === 1
                ? "approved"
                : "rejected",
        },
      });
      setCharities(response.data.charities || []);
      setTotalPages(response.data.totalPages || 1);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch charities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, [page, searchTerm, tabValue]);

  // Handle charity approval
  const handleApprove = async () => {
    if (!selectedCharity) return;

    try {
      await api.put(`/admin/charities/${selectedCharity._id}/approve`);
      setSuccess(
        `Charity "${selectedCharity.charityDetails?.organizationName || selectedCharity.fullName}" approved successfully!`,
      );
      setOpenDialog(false);
      fetchCharities();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve charity");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle charity rejection
  const handleReject = async () => {
    if (!selectedCharity) return;

    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      await api.put(`/admin/charities/${selectedCharity._id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });
      setSuccess(
        `Charity "${selectedCharity.charityDetails?.organizationName || selectedCharity.fullName}" rejected successfully!`,
      );
      setOpenDialog(false);
      setRejectionReason("");
      fetchCharities();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject charity");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle charity verification
  const handleVerify = async () => {
    if (!selectedCharity) return;

    try {
      await api.put(`/admin/charities/${selectedCharity._id}/verify`);
      setSuccess(
        `Charity "${selectedCharity.charityDetails?.organizationName || selectedCharity.fullName}" verified successfully!`,
      );
      setOpenDialog(false);
      fetchCharities();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify charity");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle charity suspension
  const handleSuspend = async () => {
    if (!selectedCharity) return;

    try {
      await api.put(`/admin/charities/${selectedCharity._id}/suspend`);
      setSuccess(
        `Charity "${selectedCharity.charityDetails?.organizationName || selectedCharity.fullName}" suspended successfully!`,
      );
      setOpenDialog(false);
      fetchCharities();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to suspend charity");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle charity activation
  const handleActivate = async () => {
    if (!selectedCharity) return;

    try {
      await api.put(`/admin/charities/${selectedCharity._id}/activate`);
      setSuccess(
        `Charity "${selectedCharity.charityDetails?.organizationName || selectedCharity.fullName}" activated successfully!`,
      );
      setOpenDialog(false);
      fetchCharities();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to activate charity");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Open action dialog
  const openActionDialog = (charity, action) => {
    setSelectedCharity(charity);
    setDialogAction(action);
    setRejectionReason("");
    setOpenDialog(true);
  };

  // Get status chip
  const getStatusChip = (charity) => {
    if (!charity.isApproved) {
      return (
        <Chip
          label="Pending"
          size="small"
          sx={{ backgroundColor: "rgba(243, 156, 18, 0.15)", color: "#f39c12" }}
        />
      );
    }
    if (charity.charityDetails?.verified) {
      return (
        <Chip
          label="Verified"
          size="small"
          sx={{ backgroundColor: "rgba(46, 204, 113, 0.15)", color: "#2ecc71" }}
        />
      );
    }
    if (!charity.isActive) {
      return (
        <Chip
          label="Suspended"
          size="small"
          sx={{ backgroundColor: "rgba(231, 76, 60, 0.15)", color: "#e74c3c" }}
        />
      );
    }
    return (
      <Chip
        label="Approved"
        size="small"
        sx={{ backgroundColor: "rgba(52, 152, 219, 0.15)", color: "#3498db" }}
      />
    );
  };

  // Get dialog content based on action
  const getDialogContent = () => {
    const charityName =
      selectedCharity?.charityDetails?.organizationName ||
      selectedCharity?.fullName ||
      "Charity";

    switch (dialogAction) {
      case "view":
        return {
          title: "Charity Details",
          message: `Viewing comprehensive details for "${charityName}".`,
          action: () => {},
          color: isDark ? "#a0a0b8" : "#4a4a6a",
          buttonText: "Close",
          isViewOnly: true,
        };
      case "approve":
        return {
          title: "Approve Charity",
          message: `Are you sure you want to approve "${charityName}"? This will allow them to create campaigns and receive donations.`,
          action: handleApprove,
          color: "#2ecc71",
          buttonText: "Approve",
        };
      case "reject":
        return {
          title: "Reject Charity",
          message: `Are you sure you want to reject "${charityName}"? They will not be able to create campaigns.`,
          action: handleReject,
          color: "#e74c3c",
          buttonText: "Reject",
          showReason: true,
        };
      case "verify":
        return {
          title: "Verify Charity",
          message: `Are you sure you want to verify "${charityName}"? This will add a verified badge to their profile.`,
          action: handleVerify,
          color: "#2ecc71",
          buttonText: "Verify",
        };
      case "suspend":
        return {
          title: "Suspend Charity",
          message: `Are you sure you want to suspend "${charityName}"? Their campaigns will be paused and they won't be able to create new ones.`,
          action: handleSuspend,
          color: "#e74c3c",
          buttonText: "Suspend",
        };
      case "activate":
        return {
          title: "Activate Charity",
          message: `Are you sure you want to activate "${charityName}"? They will be able to create campaigns again.`,
          action: handleActivate,
          color: "#2ecc71",
          buttonText: "Activate",
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure?",
          action: () => {},
          color: "#667eea",
          buttonText: "Confirm",
        };
    }
  };

  // Stats cards
  const statCards = [
    {
      label: "Pending Approval",
      value: stats.pending,
      icon: <PendingIcon />,
      color: "#f39c12",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: <CheckCircleIcon />,
      color: "#2ecc71",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <CancelIcon />,
      color: "#e74c3c",
    },
    {
      label: "Total Charities",
      value: stats.total,
      icon: <BusinessIcon />,
      color: "#3498db",
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
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
                }}
              >
                Charity Approval Panel
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
              >
                Review and manage charity registrations on the platform
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCharities}
              disabled={loading}
              sx={{
                borderRadius: 2,
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              }}
            >
              Refresh
            </Button>
          </Box>
        </motion.div>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: isDark ? "rgba(20,20,32,0.6)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: `${stat.color}20`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: isDark ? "#e8e8f0" : "#1a1a2e",
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters & Tabs */}
        <Paper
          sx={{
            borderRadius: 3,
            background: isDark ? "rgba(20,20,32,0.6)" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search charities..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setSearchTerm("")}
                sx={{ borderRadius: 2 }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              px: 2,
              "& .MuiTab-root": {
                color: isDark ? "#a0a0b8" : "#4a4a6a",
                "&.Mui-selected": {
                  color: "#667eea",
                },
              },
            }}
          >
            <Tab
              icon={<PendingIcon />}
              label={`Pending (${stats.pending})`}
              iconPosition="start"
            />
            <Tab
              icon={<CheckCircleIcon />}
              label={`Approved (${stats.approved})`}
              iconPosition="start"
            />
            <Tab
              icon={<CancelIcon />}
              label={`Rejected (${stats.rejected})`}
              iconPosition="start"
            />
          </Tabs>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Charity</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Registration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : charities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, color: isDark ? "#a0a0b8" : "#4a4a6a" }}
                    >
                      No charities found
                    </TableCell>
                  </TableRow>
                ) : (
                  charities.map((charity) => (
                    <TableRow key={charity._id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={charity.profileImage}
                            sx={{ width: 40, height: 40 }}
                          >
                            {charity.fullName?.charAt(0) || "C"}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: isDark ? "#e8e8f0" : "#1a1a2e",
                              }}
                            >
                              {charity.charityDetails?.organizationName ||
                                charity.fullName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                            >
                              {charity.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: isDark ? "#e8e8f0" : "#1a1a2e" }}
                        >
                          {charity.phone}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          {charity.address?.city || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: isDark ? "#e8e8f0" : "#1a1a2e" }}
                        >
                          {charity.charityDetails?.registrationNumber || "N/A"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          {charity.charityDetails?.organizationType || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(charity)}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (typeof openActionDialog === "function") {
                                  openActionDialog(charity, "view");
                                } else {
                                  console.error(
                                    "openActionDialog is not a function!",
                                  );
                                }
                              }}
                              sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {!charity.isApproved && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#2ecc71" }}
                                  onClick={() =>
                                    openActionDialog(charity, "approve")
                                  }
                                >
                                  <ThumbUpIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#e74c3c" }}
                                  onClick={() =>
                                    openActionDialog(charity, "reject")
                                  }
                                >
                                  <ThumbDownIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {/* Approved Actions */}
                          {charity.isApproved &&
                            !charity.charityDetails?.verified && (
                              <Tooltip title="Verify">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#3498db" }}
                                  onClick={() =>
                                    openActionDialog(charity, "verify")
                                  }
                                >
                                  <VerifiedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                          {/* Active/Suspend Actions */}
                          {charity.isActive && charity.isApproved && (
                            <Tooltip title="Suspend">
                              <IconButton
                                size="small"
                                sx={{ color: "#e74c3c" }}
                                onClick={() =>
                                  openActionDialog(charity, "suspend")
                                }
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {!charity.isActive && charity.isApproved && (
                            <Tooltip title="Activate">
                              <IconButton
                                size="small"
                                sx={{ color: "#2ecc71" }}
                                onClick={() =>
                                  openActionDialog(charity, "activate")
                                }
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {charities.length > 0 && (
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: isDark ? "#a0a0b8" : "#4a4a6a",
                  },
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Action Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setRejectionReason("");
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: isDark ? "rgba(20,20,32,0.95)" : "#ffffff",
              backdropFilter: "blur(20px)",
            },
          }}
        >
          {selectedCharity && (
            <>
              <DialogTitle>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {getDialogContent().title}
                  </Typography>
                  <IconButton onClick={() => setOpenDialog(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                {/* Charity Info */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    background: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={selectedCharity.profileImage}
                      sx={{ width: 50, height: 50 }}
                    >
                      {selectedCharity.fullName?.charAt(0) || "C"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {selectedCharity.charityDetails?.organizationName ||
                          selectedCharity.fullName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                      >
                        {selectedCharity.email} • {selectedCharity.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a", mb: 2 }}
                >
                  {getDialogContent().message}
                </Typography>

                {getDialogContent().showReason && (
                  <TextField
                    fullWidth
                    label="Rejection Reason"
                    multiline
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    sx={{ mt: 2 }}
                  />
                )}

                {dialogAction === "view" && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Organization Details
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          Registration Number
                        </Typography>
                        <Typography variant="body2">
                          {selectedCharity.charityDetails?.registrationNumber ||
                            "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          Organization Type
                        </Typography>
                        <Typography variant="body2">
                          {selectedCharity.charityDetails?.organizationType ||
                            "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          Mission Statement
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: "italic" }}
                        >
                          {selectedCharity.charityDetails?.missionStatement ||
                            "Not provided"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          Address
                        </Typography>
                        <Typography variant="body2">
                          {selectedCharity.address?.street || ""}{" "}
                          {selectedCharity.address?.city || ""}{" "}
                          {selectedCharity.address?.state || ""}{" "}
                          {selectedCharity.address?.country || ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    setRejectionReason("");
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                {dialogAction !== "view" && (
                  <Button
                    variant="contained"
                    onClick={getDialogContent().action}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: getDialogContent().color,
                      "&:hover": {
                        backgroundColor: getDialogContent().color,
                        opacity: 0.8,
                      },
                    }}
                  >
                    {getDialogContent().buttonText}
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminCharityApproval;
