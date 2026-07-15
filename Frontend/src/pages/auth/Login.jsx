import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Favorite as FavoriteIcon,
  VolunteerActivism as VolunteerIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink, replace } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { motion } from "framer-motion";
import Nav from "./components/Nav";
import { validateEmail } from "../../Utils/validators";
import { api } from "../../Services/authServices";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const isMobile = useMediaQuery("(max-width:900px)");

  const { isDark, toggleTheme } = useTheme();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await login(email, password, rememberMe);
      
     if (response?.success && response.redirectPath) {
        navigate(response.redirectPath);

    
    } else {
        navigate('/auth/login');
      }
  
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#0a0a12" : "#f8f9fa",
        transition: "background-color 0.3s ease",
      }}
    >
      <Nav />
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Side - Info/Illustration */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 6,
              position: "relative",
              overflow: "hidden",
              bgcolor: "transparent",
            }}
          >
            {/* Background Decoration */}
            <Box
              sx={{
                position: "absolute",
                top: -200,
                right: -200,
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: isDark
                  ? "radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -100,
                left: -100,
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: isDark
                  ? "radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(118,75,162,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <FavoriteIcon sx={{ fontSize: 35, color: "#fff" }} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#fff" : "#1a1a2e",
                  mb: 2,
                  lineHeight: 1.2,
                  transition: "color 0.3s ease",
                }}
              >
                Welcome Back to
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Giving with Purpose
                </span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                  mb: 4,
                  maxWidth: 400,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  transition: "color 0.3s ease",
                }}
              >
                Continue your journey of making a difference. Connect with
                verified charities and track your impact in real-time.
              </Typography>

              {/* Features */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    icon: <SecurityIcon />,
                    text: "Secure donations with enterprise-grade encryption",
                  },
                  {
                    icon: <VolunteerIcon />,
                    text: "100% verified charities and campaigns",
                  },
                  {
                    icon: <LoginIcon />,
                    text: "Real-time impact tracking and updates",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          bgcolor: isDark
                            ? "rgba(102,126,234,0.15)"
                            : "rgba(102,126,234,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#667eea",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  mt: 4,
                  pt: 3,
                  borderTop: isDark
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(0,0,0,0.06)",
                  transition: "border-color 0.3s ease",
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: isDark ? "#fff" : "#1a1a2e", fontWeight: 700 }}
                  >
                    50K+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.5)",
                    }}
                  >
                    Active Donors
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: isDark ? "#fff" : "#1a1a2e", fontWeight: 700 }}
                  >
                    $2.5M+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.5)",
                    }}
                  >
                    Donations Raised
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: isDark ? "#fff" : "#1a1a2e", fontWeight: 700 }}
                  >
                    1.2K+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.5)",
                    }}
                  >
                    Campaigns Funded
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: 4, md: 6 },
            position: "relative",
          }}
        >
          {isMobile && (
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ width: "100%", maxWidth: 420 }}
          >
            <Box
              sx={{
                bgcolor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                p: { xs: 3, sm: 4 },
                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(0,0,0,0.06)",
                boxShadow: isDark
                  ? "0 20px 60px rgba(0,0,0,0.3)"
                  : "0 20px 60px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: isDark ? "#fff" : "#1a1a2e",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  }}
                >
                  Sign in to continue your charitable journey
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                {authError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      bgcolor: isDark
                        ? "rgba(231,76,60,0.1)"
                        : "rgba(231,76,60,0.05)",
                      color: isDark ? "#ec7063" : "#c0392b",
                    }}
                  >
                    {authError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#667eea" },
                    },
                    "& .MuiInputLabel-root": {
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.5)",
                    },
                    "& .MuiInputBase-input": {
                      color: isDark ? "#fff" : "#1a1a2e",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#667eea" },
                    },
                    "& .MuiInputLabel-root": {
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.5)",
                    },
                    "& .MuiInputBase-input": {
                      color: isDark ? "#fff" : "#1a1a2e",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(0,0,0,0.3)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(0,0,0,0.3)",
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)",
                          "&.Mui-checked": { color: "#667eea" },
                        }}
                      />
                    }
                    label="Remember me"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(0,0,0,0.6)",
                    }}
                  />
                  <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
                    variant="body2"
                    sx={{
                      color: "#667eea",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(102,126,234,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Divider
                  sx={{
                    my: 3,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.3)",
                      px: 2,
                    }}
                  >
                    OR CONTINUE WITH
                  </Typography>
                </Divider>

                <SocialLogin  redirectPath="/"/>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.4)",
                    }}
                  >
                    Don't have an account?{" "}
                    <Link
                      component={RouterLink}
                      to="/auth/register"
                      sx={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Link,
//   Alert,
//   InputAdornment,
//   IconButton,
//   FormControlLabel,
//   Checkbox,
//   Divider,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Email as EmailIcon,
//   Lock as LockIcon,
//   Visibility,
//   VisibilityOff,
// } from '@mui/icons-material';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import AuthLayout from './components/AuthLayout';
// import SocialLogin from './components/SocialLogin';
// import { useAuth } from '../../hooks/useAuth';
// import { useFormValidation } from '../../hooks/useFormValidation';
// import { validateEmail, validatePassword } from '../../Utils/validators';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, loading, error: authError } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);

//   // Validation function
//   const validateForm = (values) => {
//     const errors = {};
//     if (!values.email) {
//       errors.email = 'Email is required';
//     } else if (!validateEmail(values.email)) {
//       errors.email = 'Please enter a valid email address';
//     }
//     if (!values.password) {
//       errors.password = 'Password is required';
//     } else if (!validatePassword(values.password)) {
//       errors.password = 'Password must be at least 8 characters';
//     }
//     return errors;
//   };

//   // Use form validation hook
//   const {
//     values,
//     errors,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     setFieldValue,
//     isFieldValid,
//     isFieldTouched,
//     getFieldError,
//   } = useFormValidation(
//     {
//       email: '',
//       password: '',
//       rememberMe: false,
//     },
//     validateForm
//   );

//   const onSubmit = async (formData) => {
//     try {
//       await login(formData.email, formData.password, formData.rememberMe);
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//     }
//   };

//   // Helper to show error
//   const showError = (field) => {
//     return isFieldTouched(field) && !isFieldValid(field);
//   };

//   return (
//     <AuthLayout
//       title="Welcome Back"
//       subtitle="Sign in to continue your charitable journey"
//       illustration="/images/auth/login-illustration.svg"
//     >
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {authError && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {authError}
//           </Alert>
//         )}

//         <TextField
//           fullWidth
//           label="Email Address"
//           name="email"
//           type="email"
//           value={values.email}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           error={showError('email')}
//           helperText={showError('email') ? getFieldError('email') : ''}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <EmailIcon color="action" />
//               </InputAdornment>
//             ),
//           }}
//           sx={{ mb: 2 }}
//         />

//         <TextField
//           fullWidth
//           label="Password"
//           name="password"
//           type={showPassword ? 'text' : 'password'}
//           value={values.password}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           error={showError('password')}
//           helperText={showError('password') ? getFieldError('password') : ''}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <LockIcon color="action" />
//               </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowPassword(!showPassword)}
//                   edge="end"
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//           sx={{ mb: 2 }}
//         />

//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 name="rememberMe"
//                 checked={values.rememberMe}
//                 onChange={(e) => setFieldValue('rememberMe', e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="Remember me"
//           />
//           <Link
//             component={RouterLink}
//             to="/auth/forgot-password"
//             variant="body2"
//             sx={{ textDecoration: 'none' }}
//           >
//             Forgot password?
//           </Link>
//         </Box>

//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           size="large"
//           disabled={loading}
//           sx={{
//             py: 1.5,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             '&:hover': {
//               background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
//             },
//             mb: 2
//           }}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
//         </Button>

//         <Divider sx={{ my: 2 }}>
//           <Typography variant="body2" color="textSecondary">
//             OR
//           </Typography>
//         </Divider>

//         <SocialLogin />

//         <Box sx={{ textAlign: 'center', mt: 2 }}>
//           <Typography variant="body2" color="textSecondary">
//             Don't have an account?{' '}
//             <Link
//               component={RouterLink}
//               to="/auth/register"
//               sx={{ textDecoration: 'none', fontWeight: 600 }}
//             >
//               Sign Up
//             </Link>
//           </Typography>
//         </Box>
//       </form>
//     </AuthLayout>
//   );
// };

// export default Login;
