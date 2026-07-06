import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import PasswordStrength from './components/PasswordStrength';
import OTPInput from './components/OTPInput';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePhone, validatePassword } from '../../Utils/validators';
import Nav from './components/Nav';

const steps = ['Account Type', 'Personal Info', 'Verification'];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    userType: 'donor',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.userType) {
        newErrors.userType = 'Please select an account type';
      }
    } else if (step === 1) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 1) {
        // Send OTP
        sendOTP();
      }
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const sendOTP = () => {
    // Simulate sending OTP
    setOtpSent(true);
    // In real implementation, call API to send OTP
  };

  const handleVerifyOTP = (otp) => {
    // Verify OTP
    if (otp.length === 6) {
      setOtpVerified(true);
      // In real implementation, call API to verify OTP
    }
  };

  const handleSubmit = async () => {
    if (!otpVerified) {
      setErrors({ otp: 'Please verify your phone number' });
      return;
    }

    try {
      await register(formData);
      navigate('/auth/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              I want to register as a:
            </FormLabel>
            <RadioGroup
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: formData.userType === 'donor' ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: formData.userType === 'donor' ? 'primary.50' : 'transparent',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'donor' }))}
                >
                  <FormControlLabel
                    value="donor"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Donor
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Make donations and support causes
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>

                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: formData.userType === 'charity' ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: formData.userType === 'charity' ? 'primary.50' : 'transparent',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'charity' }))}
                >
                  <FormControlLabel
                    value="charity"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Charity Organization
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Raise funds and manage campaigns
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>
              </Box>
            </RadioGroup>
            {errors.userType && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors.userType}
              </Typography>
            )}
          </FormControl>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 2 }}
            />

            {formData.password && <PasswordStrength password={formData.password} />}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              We've sent a verification code to <strong>{formData.phone}</strong>
            </Alert>
            
            <OTPInput 
              length={6}
              onComplete={handleVerifyOTP}
              disabled={otpVerified}
            />

            {otpVerified && (
              <Alert 
                icon={<CheckCircleIcon />} 
                severity="success" 
                sx={{ mt: 2 }}
              >
                Phone number verified successfully!
              </Alert>
            )}

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link 
                component="button" 
                variant="body2"
                onClick={sendOTP}
                sx={{ textDecoration: 'none' }}
              >
                Resend verification code
              </Link>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <Nav/>
    <AuthLayout
      title="Create Account"
      subtitle="Join us in making a difference"
      illustration="/images/auth/register-illustration.svg"
    >
      <Stepper 
        activeStep={activeStep} 
        sx={{ mb: 4 }}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !otpVerified}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              Next
            </Button>
          )}
        </Box>

        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/auth/login"
                sx={{ textDecoration: 'none', fontWeight: 600 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        )}
      </form>
    </AuthLayout>
    </>
  );
};

export default Register;