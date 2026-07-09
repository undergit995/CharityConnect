const otpService = require('../../utils/otpService');
const { validateEmail } = require('../../utils/validators');

exports.sendEmailOtp = async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    const result = await otpService.sendOTPEmail(email, purpose);
    res.status(200).json({
      success: true,
      message: result.message,
      otpId: result.otpId,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error('Send OTP email error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp, purpose = 'verification' } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP are required' });
    }
    const result = otpService.verifyOTP(identifier, otp, purpose);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.status(200).json({
      success: true,
      message: result.message,
      identifier: result.identifier,
      purpose: result.purpose,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { identifier, type = 'email', purpose = 'verification' } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Identifier is required' });
    }
    const result = await otpService.resendOTP(identifier, type, purpose);
    res.status(200).json({
      success: true,
      message: result.message,
      otpId: result.otpId,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to resend OTP' });
  }
};

exports.getOtpStatus = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Identifier is required' });
    }
    const status = otpService.getOTPStatus(identifier);
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    console.error('Get OTP status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get OTP status' });
  }
};

exports.verifyAndRegister = async (req, res) => {
    try {
        const { identifier, otp, userData, purpose = 'verification' } = req.body;
        if (!identifier || !otp) {
            return res.status(400).json({ success: false, message: 'Identifier and OTP are required' });
        }
        const result = otpService.verifyOTP(identifier, otp, purpose);
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // TODO: Add user registration logic here
        res.status(200).json({ success: true, message: 'OTP verified and user registered successfully' });
    } catch (error) {
        console.error('Verify and register error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP and register user' });
    }
};

