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
//   Stepper,
//   Step,
//   StepLabel,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Divider,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Lock as LockIcon,
//   Visibility,
//   VisibilityOff,
//   CheckCircle as CheckCircleIcon,
// } from '@mui/icons-material';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import AuthLayout from './components/AuthLayout';
// import PasswordStrength from './components/PasswordStrength';
// import OTPInput from './components/OTPInput';
// import { useAuth } from '../../hooks/useAuth';
// import { validateEmail, validatePhone, validatePassword } from '../../Utils/validators';
// import Nav from './components/Nav';
// import { api } from '../../Services/authServices';

// const steps = ['Account Type', 'Personal Info', 'Verification'];

// const Register = () => {
//   const navigate = useNavigate();
//   const { register, loading, error } = useAuth();
//   const [activeStep, setActiveStep] = useState(0);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const [formData, setFormData] = useState({
//     userType: 'donor',
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     acceptTerms: false,
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (step === 0) {
//       if (!formData.userType) {
//         newErrors.userType = 'Please select an account type';
//       }
//     } else if (step === 1) {
//       if (!formData.firstName) {
//         newErrors.firstName = 'First name is required';
//       }
//       if (!formData.lastName) {
//         newErrors.lastName = 'Last name is required';
//       }
//       if (!formData.email) {
//         newErrors.email = 'Email is required';
//       } else if (!validateEmail(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
//       if (!formData.phone) {
//         newErrors.phone = 'Phone number is required';
//       } else if (!validatePhone(formData.phone)) {
//         newErrors.phone = 'Please enter a valid phone number';
//       }
//       if (!formData.password) {
//         newErrors.password = 'Password is required';
//       } else if (!validatePassword(formData.password)) {
//         newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
//       }
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       if (activeStep === 1) {
//         // Send OTP
//         sendOTP();
//       }
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const sendOTP = () => {
//     // Simulate sending OTP
//     setOtpSent(true);

//   };

//   const handleVerifyOTP = (otp) => {

//     if (otp.length === 6) {
//       setOtpVerified(true);

//     }
//   };

//   const handleSubmit = async () => {
//     if (!otpVerified) {
//       setErrors({ otp: 'Please verify your Email' });
//       return;
//     }

//     try {
//       await api.post(formData);
//       navigate('/auth/verify-email', { state: { email: formData.email } });
//     } catch (err) {
//       console.error('Registration error:', err);
//     }
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <FormControl component="fieldset" sx={{ width: '100%' }}>
//             <FormLabel component="legend" sx={{ mb: 2 }}>
//               I want to register as a
//             </FormLabel>
//             <RadioGroup
//               name="userType"
//               value={formData.userType}
//               onChange={handleChange}
//             >
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//                 <Box
//                   sx={{
//                     border: '2px solid',
//                     borderColor: formData.userType === 'donor' ? 'primary.main' : 'grey.300',
//                     borderRadius: 2,
//                     p: 2,
//                     cursor: 'pointer',
//                     bgcolor: formData.userType === 'donor' ? 'primary.50' : 'transparent',
//                     transition: 'all 0.3s',
//                     '&:hover': {
//                       borderColor: 'primary.main',
//                     }
//                   }}
//                   onClick={() => setFormData(prev => ({ ...prev, userType: 'donor' }))}
//                 >
//                   <FormControlLabel
//                     value="donor"
//                     control={<Radio />}
//                     label={
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight={600}>
//                           Donor
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           Make donations and support causes
//                         </Typography>
//                       </Box>
//                     }
//                     sx={{ alignItems: 'flex-start' }}
//                   />
//                 </Box>

//                 <Box
//                   sx={{
//                     border: '2px solid',
//                     borderColor: formData.userType === 'charity' ? 'primary.main' : 'grey.300',
//                     borderRadius: 2,
//                     p: 2,
//                     cursor: 'pointer',
//                     bgcolor: formData.userType === 'charity' ? 'primary.50' : 'transparent',
//                     transition: 'all 0.3s',
//                     '&:hover': {
//                       borderColor: 'primary.main',
//                     }
//                   }}
//                   onClick={() => setFormData(prev => ({ ...prev, userType: 'charity' }))}
//                 >
//                   <FormControlLabel
//                     value="charity"
//                     control={<Radio />}
//                     label={
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight={600}>
//                           Charity Organization
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           Raise funds and manage campaigns
//                         </Typography>
//                       </Box>
//                     }
//                     sx={{ alignItems: 'flex-start' }}
//                   />
//                 </Box>
//               </Box>
//             </RadioGroup>
//             {errors.userType && (
//               <Typography color="error" variant="caption" sx={{ mt: 1 }}>
//                 {errors.userType}
//               </Typography>
//             )}
//           </FormControl>
//         );

//       case 1:
//         return (
//           <Box>
//             <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 error={!!errors.firstName}
//                 helperText={errors.firstName}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 error={!!errors.lastName}
//                 helperText={errors.lastName}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box>

//             <TextField
//               fullWidth
//               label="Email Address"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               error={!!errors.email}
//               helperText={errors.email}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <EmailIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mt: 2 }}
//             />

//             <TextField
//               fullWidth
//               label="Phone Number"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               error={!!errors.phone}
//               helperText={errors.phone}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PhoneIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mt: 2 }}
//             />

//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={handleChange}
//               error={!!errors.password}
//               helperText={errors.password}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mt: 2 }}
//             />

//             {formData.password && <PasswordStrength password={formData.password} />}

//             <TextField
//               fullWidth
//               label="Confirm Password"
//               name="confirmPassword"
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               error={!!errors.confirmPassword}
//               helperText={errors.confirmPassword}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       edge="end"
//                     >
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mt: 2 }}
//             />
//           </Box>
//         );

//       case 2:
//         return (
//           <Box>
//             <Alert severity="info" sx={{ mb: 3 }}>
//               We've sent a verification code to <strong>{formData.phone}</strong>
//             </Alert>

//             <OTPInput
//               length={6}
//               onComplete={handleVerifyOTP}
//               disabled={otpVerified}
//             />

//             {otpVerified && (
//               <Alert
//                 icon={<CheckCircleIcon />}
//                 severity="success"
//                 sx={{ mt: 2 }}
//               >
//                 Phone number verified successfully!
//               </Alert>
//             )}

//             <Box sx={{ mt: 2, textAlign: 'center' }}>
//               <Link
//                 component="button"
//                 variant="body2"
//                 onClick={sendOTP}
//                 sx={{ textDecoration: 'none' }}
//               >
//                 Resend verification code
//               </Link>
//             </Box>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//     <Nav/>
//     <AuthLayout
//       title="Create Account"
//       subtitle="Join us in making a difference"
//       illustration="/images/auth/register-illustration.svg"
//     >
//       <Stepper
//         activeStep={activeStep}
//         sx={{ mb: 4 }}
//         alternativeLabel
//       >
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <form>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {getStepContent(activeStep)}

//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//           <Button
//             variant="outlined"
//             onClick={handleBack}
//             disabled={activeStep === 0}
//           >
//             Back
//           </Button>

//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading || !otpVerified}
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
//                 },
//               }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
//                 },
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>

//         {activeStep === 0 && (
//           <Box sx={{ textAlign: 'center', mt: 2 }}>
//             <Typography variant="body2" color="textSecondary">
//               Already have an account?{' '}
//               <Link
//                 component={RouterLink}
//                 to="/auth/login"
//                 sx={{ textDecoration: 'none', fontWeight: 600 }}
//               >
//                 Sign In
//               </Link>
//             </Typography>
//           </Box>
//         )}
//       </form>
//     </AuthLayout>
//     </>
//   );
// };

// export default Register;

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../Services/authServices";
import {
  validateEmail,
  validatePhone,
  validatePasswordDetailed,
  validateNameDetailed,
} from "../../Utils/validators";
import OTPInput from "./components/OTPInput";
import PasswordStrength from "./components/PasswordStrength";

const steps = ["Account Type", "Personal Info", "Verification"];

const Register = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { register, loading } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpError, setOtpError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "donor",
    acceptTerms: false,
  organizationName:'',
  organizationType:'',
  registrationNumber:'',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [otpId, setOtpId] = useState("");

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.role) {
        newErrors.role = "Please select an account type";
      }
    } else if (step === 1) {
      // First Name
      const firstNameResult = validateNameDetailed(
        formData.firstName,
        "First name",
      );
      if (!firstNameResult.isValid) {
        newErrors.firstName = firstNameResult.error;
      }

      // Last Name
      const lastNameResult = validateNameDetailed(
        formData.lastName,
        "Last name",
      );
      if (!lastNameResult.isValid) {
        newErrors.lastName = lastNameResult.error;
      }

      // Email
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Phone
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }

      // Password
      const passwordResult = validatePasswordDetailed(formData.password);
      if (!passwordResult.isValid) {
        newErrors.password = passwordResult.errors[0];
      }

      // Confirm Password
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP via email
  const sendOTP = async () => {
    // First validate email
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setServerError("");

    try {
      const response = await api.post("/otp/send-email", {
        email: formData.email,
        purpose: "verification",
      });

      if (response.data.success) {
        setOtpSent(true);
        setOtpId(response.data.otpId);
        setResendCooldown(60);
        setErrors((prev) => ({ ...prev, otp: "" }));
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      const message =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setOtpError(message);
      setErrors((prev) => ({ ...prev, otp: message }));
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otp) => {
    if (otp.length === 6) {
      setOtpLoading(true);
      setOtpError("");

      try {
        const response = await api.post("/otp/verify", {
          identifier: formData.email,
          otp: otp,
          purpose: "verification",
        });

        if (response.data.success) {
          setOtpVerified(true);
          setErrors((prev) => ({ ...prev, otp: "" }));
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        const message =
          error.response?.data?.message || "Invalid OTP. Please try again.";
        setOtpError(message);
        setErrors((prev) => ({ ...prev, otp: message }));
        // Reset OTP input if verification fails
        setOtpVerified(false);
      } finally {
        setOtpLoading(false);
      }
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await api.post("/otp/resend", {
        identifier: formData.email,
        type: "email",
        purpose: "verification",
      });

      if (response.data.success) {
        setResendCooldown(60);
        setOtpSent(true);
        setOtpError("");
        setErrors((prev) => ({ ...prev, otp: "" }));
        // Reset OTP verified state
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      const message =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      setOtpError(message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Final Registration Submit
  const handleSubmit = async () => {
    // Validate OTP
    if (!otpVerified) {
      setErrors((prev) => ({
        ...prev,
        otp: "Please verify your email with the OTP sent",
      }));
      return;
    }

    setServerError("");
    setOtpError("");

    try {
      // Prepare data matching your User schema
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        acceptTerms: formData.acceptTerms,
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      };

      
      if (formData.role === "charity") {
        userData.charityDetails = {
          organizationName: formData.organizationName || "",
          organizationType: formData.organizationType || "Non-Profit",
          registrationNumber: formData.registrationNumber || "",
          verified: false,
        };
      }

      const response = await api.post('auth/regsiter',userData);

      // Check if registration was successful
      if (response?.data?.success) {
        // Navigate based on role or general dashboard
        if (response?.data?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response?.data?.user?.role === "charity") {
          navigate("/charity/dashboard");
        } else if (response?.data?.user?.role === "donor") {
          navigate("/donor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // If email verification required or other cases
        navigate("/auth/verify-email", {
          state: {
            email: formData.email,
            message: "Please verify your email address to continue.",
          },
        });
      }
    } catch (err) {
      console.error("Registration error:", err);

      // Handle specific error cases
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      // Check for duplicate email/phone errors
      if (errorMessage.includes("email already exists")) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      } else if (errorMessage.includes("phone already exists")) {
        setErrors((prev) => ({
          ...prev,
          phone: "This phone number is already registered",
        }));
      } else {
        setServerError(errorMessage);
      }
    }
  };

  // Go to next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 1) {
        // Send OTP when moving to verification step
        sendOTP();
      }
      setActiveStep((prev) => prev + 1);
    }
  };

  // Go to previous step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{ mb: 2, color: isDark ? "#a0a0b8" : "#4a4a6a" }}
            >
              I want to register as a:
            </FormLabel>
            <RadioGroup
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                {/* Donor Option */}
                <Box
                  sx={{
                    border: "2px solid",
                    borderColor:
                      formData.role === "donor"
                        ? "#2ecc71"
                        : isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    p: 2,
                    cursor: "pointer",
                    bgcolor:
                      formData.role === "donor"
                        ? isDark
                          ? "rgba(46, 204, 113, 0.15)"
                          : "rgba(46, 204, 113, 0.08)"
                        : "transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#2ecc71",
                    },
                  }}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "donor" }))
                  }
                >
                  <FormControlLabel
                    value="donor"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ color: isDark ? "#e8e8f0" : "#1a1a2e" }}
                        >
                          Donor
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          Make donations and support causes
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: "flex-start", m: 0 }}
                  />
                </Box>

                {/* Charity Option */}
                <Box
                  sx={{
                    border: "2px solid",
                    borderColor:
                      formData.role === "charity"
                        ? "#9b59b6"
                        : isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    p: 2,
                    cursor: "pointer",
                    bgcolor:
                      formData.role === "charity"
                        ? isDark
                          ? "rgba(155, 89, 182, 0.15)"
                          : "rgba(155, 89, 182, 0.08)"
                        : "transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#9b59b6",
                    },
                  }}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "charity" }))
                  }
                >
                  <FormControlLabel
                    value="charity"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ color: isDark ? "#e8e8f0" : "#1a1a2e" }}
                        >
                          Charity Organization
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? "#6a6a80" : "#9a9ab0" }}
                        >
                          Raise funds and manage campaigns
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: "flex-start", m: 0 }}
                  />
                </Box>
              </Box>
            </RadioGroup>
            {errors.role && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors.role}
              </Typography>
            )}
          </FormControl>
        );

      case 1:
        return (
          <Box>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{
                          color: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{
                          color: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: 2,
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

            {formData.password && (
              <PasswordStrength password={formData.password} />
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: 2,
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                      }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.role === "charity" && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Registration Number (Optional)"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                bgcolor: isDark
                  ? "rgba(52, 152, 219, 0.1)"
                  : "rgba(52, 152, 219, 0.05)",
                color: isDark ? "#5dade2" : "#2a7fb8",
              }}
            >
              <Typography variant="body2">
                We've sent a verification code to{" "}
                <strong>{formData.email}</strong>
              </Typography>
            </Alert>

            {serverError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {serverError}
              </Alert>
            )}

            {otpError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {otpError}
              </Alert>
            )}

            {errors.otp && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errors.otp}
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <OTPInput
                length={6}
                onComplete={handleVerifyOTP}
                disabled={otpVerified || otpLoading}
              />

              {otpLoading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
                  >
                    Verifying...
                  </Typography>
                </Box>
              )}

              {otpVerified && (
                <Alert
                  icon={<CheckCircleIcon />}
                  severity="success"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    bgcolor: isDark
                      ? "rgba(46, 204, 113, 0.1)"
                      : "rgba(46, 204, 113, 0.05)",
                  }}
                >
                  Email verified successfully!
                </Alert>
              )}
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
              >
                Didn't receive the code?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || otpLoading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#667eea",
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(102, 126, 234, 0.1)"
                        : "rgba(102, 126, 234, 0.05)",
                    },
                  }}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </Button>
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark
          ? "linear-gradient(135deg, #0a0a12 0%, #141420 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: isDark
                ? "rgba(20, 20, 32, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: isDark
                ? "0 8px 40px rgba(0,0,0,0.4)"
                : "0 8px 40px rgba(0,0,0,0.08)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)"}`,
              transition: "all 0.3s ease",
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight={700}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
              >
                Join us in making a difference
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#667eea",
                },
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#2ecc71",
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Content */}
            {getStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  borderRadius: 2,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  color: isDark ? "#a0a0b8" : "#4a4a6a",
                  "&:hover": {
                    borderColor: "#667eea",
                    backgroundColor: isDark
                      ? "rgba(102, 126, 234, 0.1)"
                      : "rgba(102, 126, 234, 0.05)",
                  },
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !otpVerified}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(102, 126, 234, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(102, 126, 234, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Next
                </Button>
              )}
            </Box>

            {/* Login Link */}
            {activeStep === 0 && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: isDark ? "#a0a0b8" : "#4a4a6a" }}
                >
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/auth/login"
                    sx={{
                      textDecoration: "none",
                      fontWeight: 600,
                      color: "#667eea",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
