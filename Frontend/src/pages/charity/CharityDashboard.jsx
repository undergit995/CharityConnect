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
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../Context/AuthContext";
import { api } from "../../Services/authServices";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import StatsCard from "./components/StatsChart";
import CampaignStatusCard from "./components/CampaignCard";

// Main Charity Dashboard
const CharityDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [period, setPeriod] = useState("month");

  const [campaignStatus, setCampaignStatus] = useState({
    total: 0,
    active: 0,
    draft: 0,
    pending: 0,
    paused: 0,
    completed: 0,
  });
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;

    const checkEligibility = async () => {
      try {
        const response = await api.get(`/verification/eligibility/${user.userId}`);
        setIsEligible(response.data.data.isEligible);
      } catch (error) {
        //console.error('Failed to check eligibility:', error);
      }
    };
    checkEligibility();
  }, [user]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/charity/dashboard/stats", {
        params: { period },
      });

      if (response.data.success) {
        const { stats, charts, recentActivity, campaignStatus } =
          response.data.data;
        setStats(stats);
        setCharts(charts);
        setRecentActivity(recentActivity || []);
        setCampaignStatus(
          campaignStatus || {
            total: 0,
            active: 0,
            draft: 0,
            pending: 0,
            paused: 0,
            completed: 0,
          },
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  // Prepare chart data
  const prepareDonationTrendData = () => {
    if (!charts?.donationTrend) return [];
    return charts.donationTrend.labels.map((label, index) => ({
      name: label,
      amount: charts.donationTrend.amounts[index] || 0,
      count: charts.donationTrend.counts[index] || 0,
    }));
  };

  const prepareCategoryData = () => {
    if (!charts?.categoryDistribution) return [];
    return charts.categoryDistribution.labels.map((label, index) => ({
      name: label,
      value: charts.categoryDistribution.counts[index] || 0,
    }));
  };

  const prepareMonthlyDonations = () => {
    if (!charts?.monthlyDonations) return [];
    return charts.monthlyDonations.labels.map((label, index) => ({
      name: label,
      amount: charts.monthlyDonations.amounts[index] || 0,
    }));
  };

  const COLORS = [
    "#667eea",
    "#764ba2",
    "#2ecc71",
    "#f39c12",
    "#e74c3c",
    "#3498db",
    "#1abc9c",
    "#9b59b6",
    "#e67e22",
    "#95a5a6",
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        {!isEligible && (null
        // <Alert severity="warning">
        //   Complete your verification to start fundraising.
        //   <Button onClick={() => navigate('/charity/documents')}>
        //     Complete Verification
        //   </Button>
        // </Alert>
      )}
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
                mb: 0.5,
              }}
            >
              Welcome back, {user?.fullName || "Charity"} 
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
            >
              Here's your campaign performance overview
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPeriod(period === "month" ? "week" : "month")}
              sx={{ borderRadius: 2 }}
            >
              {period === "month" ? "Monthly" : "Weekly"}
            </Button>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchDashboardData}
                disabled={loading}
                sx={{
                  color: isDark ? "#a0a0b8" : "#4a4a6a",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Campaigns"
              value={campaignStatus.total || 0}
              icon={<CampaignIcon />}
              color="#3498db"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Campaigns"
              value={campaignStatus.active || 0}
              icon={<CheckCircleIcon />}
              color="#2ecc71"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Raised"
              value={`₹${stats?.totalRaised?.toLocaleString('en-IN') || 0}`}
              icon={<MoneyIcon />}
              color="#f39c12"
              trend={stats?.growth > 0 ? "up" : "down"}
              percentage={Math.abs(stats?.growth || 0)}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Donors"
              value={stats?.totalDonors?.toLocaleString('en-IN') || 0}
              icon={<PeopleIcon />}
              color="#9b59b6"
              subtitle={`+${stats?.newDonors || 0} this month`}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Campaign Status Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4} sm={2}>
            <CampaignStatusCard
              status="Total"
              count={campaignStatus.total}
              color="#3498db"
              icon={<CampaignIcon />}
              loading={loading}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <CampaignStatusCard
              status="Active"
              count={campaignStatus.active}
              color="#2ecc71"
              icon={<CheckCircleIcon />}
              loading={loading}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <CampaignStatusCard
              status="Draft"
              count={campaignStatus.draft}
              color="#95a5a6"
              icon={<CampaignIcon />}
              loading={loading}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <CampaignStatusCard
              status="Pending"
              count={campaignStatus.pending}
              color="#f39c12"
              icon={<PendingIcon />}
              loading={loading}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <CampaignStatusCard
              status="Paused"
              count={campaignStatus.paused}
              color="#3498db"
              icon={<PauseIcon />}
              loading={loading}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <CampaignStatusCard
              status="Completed"
              count={campaignStatus.completed}
              color="#9b59b6"
              icon={<CheckCircleIcon />}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        {!loading && charts && (
          <>
            <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ mb: 4 }}>
              {/* Donation Analytics */}
              <Grid size={{xs:12,lg:7}}>
                <Box
                  sx={{
                    p: "1px",
                    borderRadius: "28px",
                    background: isDark
                      ? "linear-gradient(135deg,#6366F1,#06B6D4,#8B5CF6)"
                      : "linear-gradient(135deg,#2563EB,#06B6D4,#8B5CF6)",
                    transition: "all .35s ease",
                    "&:hover": {
                      transform: { xs: "none", md: "translateY(-6px)" },
                      boxShadow: isDark
                        ? "0 30px 80px rgba(99,102,241,.35)"
                        : "0 25px 60px rgba(37,99,235,.20)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "27px",
                      overflow: "hidden",
                      backdropFilter: "blur(25px)",
                      background: isDark
                        ? "linear-gradient(180deg,#111827,#0F172A)"
                        : "linear-gradient(180deg,#FFFFFF,#F8FAFC)",
                      border: `1px solid ${
                        isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"
                      }`,
                      p: { xs: 2.5, md: 4 },
                      height: "100%",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      mb={4}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            fontWeight: 700,
                            color: "#38BDF8",
                          }}
                        >
                          Analytics
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: { xs: 24, md: 34 },
                            fontWeight: 800,
                            mt: 0.5,
                            background:
                              "linear-gradient(90deg,#6366F1,#06B6D4)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Donation Performance
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            color: isDark ? "#94A3B8" : "#64748B",
                          }}
                        >
                          Revenue & donation activity over time
                        </Typography>
                      </Box>

                      <Avatar
                        sx={{
                          width: 58,
                          height: 58,
                          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                          fontSize: 28,
                        }}
                      >
                        📈
                      </Avatar>
                    </Stack>

                    <ResponsiveContainer
                      width="100%"
                      height={isMobile ? 250 : 350}
                    >
                      <LineChart data={prepareDonationTrendData()}>
                        <defs>
                          <linearGradient
                            id="amountGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>

                          <linearGradient
                            id="countGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#F97316" />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="2 8"
                          stroke={isDark ? "#233047" : "#E5E7EB"}
                        />

                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          stroke={isDark ? "#94A3B8" : "#64748B"}
                        />

                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          stroke={isDark ? "#94A3B8" : "#64748B"}
                        />

                        <ChartTooltip
                          contentStyle={{
                            border: "none",
                            borderRadius: 18,
                            backdropFilter: "blur(20px)",
                            background: isDark
                              ? "rgba(15,23,42,.95)"
                              : "#FFFFFF",
                            color: isDark ? "#fff" : "#111827",
                            boxShadow: "0 15px 45px rgba(0,0,0,.2)",
                          }}
                        />

                        <Legend wrapperStyle={{ paddingTop: 15 }} />

                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="url(#amountGradient)"
                          strokeWidth={5}
                          dot={{
                            r: 4,
                            fill: "#fff",
                            stroke: "#6366F1",
                            strokeWidth: 3,
                          }}
                          activeDot={{ r: 8 }}
                          name="Amount (₹)"
                        />

                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="url(#countGradient)"
                          strokeWidth={5}
                          dot={{
                            r: 4,
                            fill: "#fff",
                            stroke: "#EC4899",
                            strokeWidth: 3,
                          }}
                          activeDot={{ r: 8 }}
                          name="Donations"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Grid>

              {/* Categories */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Box
                  sx={{
                    p: "1px",
                    borderRadius: "28px",
                    background: isDark
                      ? "linear-gradient(135deg,#06B6D4,#8B5CF6,#EC4899)"
                      : "linear-gradient(135deg,#06B6D4,#2563EB,#8B5CF6)",
                    transition: ".35s",

                    "&:hover": {
                      transform: { xs: "none", md: "translateY(-6px)" },
                      boxShadow: isDark
                        ? "0 25px 70px rgba(139,92,246,.35)"
                        : "0 20px 60px rgba(59,130,246,.18)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "27px",
                      overflow: "hidden",
                      backdropFilter: "blur(25px)",
                      background: isDark
                        ? "linear-gradient(180deg,#111827,#0F172A)"
                        : "linear-gradient(180deg,#FFFFFF,#F8FAFC)",
                      border: `1px solid ${
                        isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"
                      }`,
                      p: { xs: 2.5, md: 4 },
                      height: "100%",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            color: "#06B6D4",
                            fontWeight: 700,
                          }}
                        >
                          Distribution
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: 22, md: 30 },
                            color: isDark ? "#F8FAFC" : "#0F172A",
                          }}
                        >
                          Campaign Categories
                        </Typography>
                      </Box>

                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg,#06B6D4,#8B5CF6)",
                        }}
                      >
                        🥧
                      </Avatar>
                    </Stack>

                    <ResponsiveContainer
                      width="100%"
                      height={isMobile ? 260 : 350}
                    >
                      <PieChart>
                        <Pie
                          data={prepareCategoryData()}
                          dataKey="value"
                          innerRadius="55%"
                          outerRadius="82%"
                          paddingAngle={5}
                          cornerRadius={12}
                          label={
                            !isMobile
                              ? ({ percent }) =>
                                  `${(percent * 100).toFixed(0)}%`
                              : false
                          }
                          labelLine={false}
                        >
                          {prepareCategoryData().map((entry, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                              stroke="transparent"
                            />
                          ))}
                        </Pie>

                        <Legend
                          layout={isMobile ? "horizontal" : "horizontal"}
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            fontSize: 12,
                            paddingTop: 15,
                          }}
                        />

                        <ChartTooltip
                          contentStyle={{
                            border: "none",
                            borderRadius: 18,
                            backdropFilter: "blur(20px)",
                            background: isDark
                              ? "rgba(15,23,42,.95)"
                              : "#FFFFFF",
                            color: isDark ? "#fff" : "#111827",
                            boxShadow: "0 15px 45px rgba(0,0,0,.2)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Monthly Donations */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: isDark ? "rgba(20,20,32,0.8)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: isDark ? "#e8e8f0" : "#1a1a2e",
                }}
              >
                Monthly Donations
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prepareMonthlyDonations()}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#2a2a3e" : "#e0e0e0"}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={isDark ? "#a0a0b8" : "#4a4a6a"}
                  />
                  <YAxis stroke={isDark ? "#a0a0b8" : "#4a4a6a"} />
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="amount" fill="#667eea" name="Amount (₹)" barSize={20} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Recent Activity */}
            {/* <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: isDark ? "rgba(20,20,32,0.8)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: isDark ? "#e8e8f0" : "#1a1a2e",
                }}
              >
                Recent Activity
              </Typography>
              {recentActivity.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? "#a0a0b8" : "#4a4a6a",
                    textAlign: "center",
                    py: 3,
                  }}
                >
                  No recent activity
                </Typography>
              ) : (
                recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom:
                        index < recentActivity.length - 1
                          ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
                          : "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(102,126,234,0.15)",
                          color: "#667eea",
                        }}
                      >
                        {activity.type === "donation" ? (
                          <DonateIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <CampaignIcon sx={{ fontSize: 16 }} />
                        )}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: isDark ? "#e8e8f0" : "#1a1a2e" }}
                        >
                          {activity.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={activity.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          activity.status === "Completed"
                            ? "rgba(46, 204, 113, 0.15)"
                            : activity.status === "Pending"
                              ? "rgba(243, 156, 18, 0.15)"
                              : "rgba(231, 76, 60, 0.15)",
                        color:
                          activity.status === "Completed"
                            ? "#2ecc71"
                            : activity.status === "Pending"
                              ? "#f39c12"
                              : "#e74c3c",
                      }}
                    />
                  </Box>
                ))
              )}
            </Paper> */}
          </>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CharityDashboard;
