import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../Context/AuthContext";
import campaignService from "../Services/campaignService";
import donationService from "../Services/donationService";
import CampaignStats from "../components/campaign/CampaignStats";
import DonationButton from "../components/campaign/DonationButton";
import DonationModal from "../components/campaign/DonationModal";
import RecentDonations from "../components/campaign/RecentDonations";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [recentDonations, setRecentDonations] = useState([]);

  useEffect(() => {
    fetchCampaignData();
  }, [id]);

  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const data = await campaignService.getCampaignForDonation(id);
      setCampaign(data);

      if (isAuthenticated && user?.savedCampaigns) {
        setIsSaved(user.savedCampaigns.includes(id));
      }

      // Get recent donations
      const donations = await donationService.getCampaignDonations(id, 5);
      setRecentDonations(donations || []);
    } catch (err) {
      setError(err.message || "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    const action = isSaved ? "unsave" : "save";
    setIsSaved(!isSaved);

    try {
      await campaignService.saveCampaign(id, action);
    } catch (error) {
      setIsSaved(isSaved);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: campaign.title,
          text: `Support "${campaign.title}" on CharityConnect`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDonationSuccess = () => {
    fetchCampaignData();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Campaign not found</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const isActive =
    campaign.status === "active" && !campaign.isExpired && campaign.isActive;

  return (
    <Box
      sx={{
        py: 3,
        minHeight: "100vh",
        backgroundColor: isDark ? "#0a0a12" : "#f8f9fa",
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: isDark ? "#a0a0b8" : "#4a4a6a" }}
        >
          Back
        </Button>

        <Grid container spacing={4}>
          {/* Left Column - Campaign Info */}
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: isDark ? "rgba(20,20,32,0.8)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              {/* Cover Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 300,
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  component="img"
                  src={
                    campaign.coverImage || "/images/campaign-placeholder.jpg"
                  }
                  alt={campaign.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {campaign.isVerified && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                    label="Verified"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(46, 204, 113, 0.9)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                )}
                {!isActive && (
                  <Chip
                    label={campaign.isExpired ? "Expired" : "Inactive"}
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: "rgba(231, 76, 60, 0.9)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>

              {/* Title & Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? "#e8e8f0" : "#1a1a2e",
                  }}
                >
                  {campaign.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />
                    }
                    onClick={handleSaveToggle}
                    sx={{
                      borderRadius: 2,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                      minWidth: 40,
                      padding: "6px 12px",
                    }}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    sx={{
                      borderRadius: 2,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                      minWidth: 40,
                      padding: "6px 12px",
                    }}
                  >
                    Share
                  </Button>
                </Box>
              </Box>

              {/* Category & Location */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Chip label={campaign.category} size="small" />
                {campaign.location && (
                  <Chip
                    icon={<LocationIcon sx={{ fontSize: 14 }} />}
                    label={campaign.location}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? "#a0a0b8" : "#4a4a6a",
                  whiteSpace: "pre-wrap",
                  mb: 3,
                }}
              >
                {campaign.description}
              </Typography>

              {/* Campaign Stats */}
              <CampaignStats campaign={campaign} />

              {/* Charity Info */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={campaign.charityId?.profileImage}
                  sx={{ width: 48, height: 48, backgroundColor: "#667eea" }}
                >
                  {campaign.charityId?.charityDetails?.organizationName?.charAt(
                    0,
                  ) || "C"}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {campaign.charityId?.charityDetails?.organizationName ||
                      campaign.charityId?.fullName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                  >
                    {campaign.charityId?.charityDetails?.verified && (
                      <VerifiedIcon
                        sx={{ fontSize: 12, color: "#2ecc71", mr: 0.5 }}
                      />
                    )}
                    Charity Organization
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Donation Card */}
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                position: "sticky",
                top: 90,
                background: isDark ? "rgba(20,20,32,0.8)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
              >
                Make a Difference
              </Typography>

              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
                >
                  Your donation helps {campaign.title}
                </Typography>
              </Box>

              <DonationButton
                campaign={campaign}
                onClick={() => {
                  navigate(`/campaigns/${campaign._id}/donate`);
                }}
              />

              <Divider sx={{ my: 3 }} />


              <RecentDonations donations={recentDonations} />
            </Paper>
          </Grid>
        </Grid>

        {/* Donation Modal */}
        {/* <DonationModal
          open={donationModalOpen}
          onClose={() => setDonationModalOpen(false)}
          campaign={campaign}
          onSuccess={handleDonationSuccess}
        /> */}
      </Container>
    </Box>
  );
};

export default CampaignDetails;
