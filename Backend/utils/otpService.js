const otpGenerator = require('otp-generator');
const { sendEmail } = require('./emailService');
const logger = require('./logger');

class OTPService {
  constructor() {
    this.otpStore = new Map();
    this.otpConfig = {
      length: 6,
      expiresIn: 300, // 5 minutes
      maxAttempts: 3,
      resendCooldown: 60, // 1 minute
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    };
  }

  
  generateOTP(length = this.otpConfig.length) {
    return otpGenerator.generate(length, {
      digits: this.otpConfig.digits,
      alphabets: this.otpConfig.alphabets,
      upperCase: this.otpConfig.upperCase,
      specialChars: this.otpConfig.specialChars,
    });
  }

  /**
   * Create and store OTP
   * @param {string} identifier - Email or phone number
   * @param {string} type - 'email' or 'phone'
   * @param {string} purpose - 'verification', 'login', 'reset-password'
   * @returns {Object} - OTP details
   */
  createOTP(identifier, type = 'email', purpose = 'verification') {
    try {
      
    const existing = this.getOTP(identifier);
    if (existing) {
      const timeSinceCreation = Date.now() - existing.createdAt;
      if (timeSinceCreation < this.otpConfig.resendCooldown * 1000) {
        throw new Error(`Please wait ${this.otpConfig.resendCooldown} seconds before requesting a new OTP`);
      }
    }

    const otp = this.generateOTP();
    const expiresAt = Date.now() + this.otpConfig.expiresIn * 1000;

    const otpData = {
      identifier,
      otp,
      type,
      purpose,
      attempts: 0,
      maxAttempts: this.otpConfig.maxAttempts,
      createdAt: Date.now(),
      expiresAt,
      verified: false,
    };

    this.otpStore.set(identifier, otpData);

    
    setTimeout(() => {
      this.otpStore.delete(identifier);
    }, this.otpConfig.expiresIn * 1000);

    return otpData;
  } catch (error) {
      logger.error('Error creating OTP:', error.message);
      throw new Error('Failed to create OTP');
    }
  }

  /**
   * Get OTP for identifier
   * @param {string} identifier - Email or phone number
   * @returns {Object|null} - OTP data or null
   */
  getOTP(identifier) {
    try {
      
    const otpData = this.otpStore.get(identifier);
    if (!otpData) return null;

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      this.otpStore.delete(identifier);
      return null;
    }

    return otpData;
    } 
    catch (error) {
      logger.error('Error getting OTP:', error.message);
      throw new Error('Failed to get OTP');
    }
  }

  /**
   * Verify OTP
   * @param {string} identifier - Email or phone number
   * @param {string} otp - OTP to verify
   * @param {string} purpose - 'verification', 'login', 'reset-password'
   * @returns {Object} - Verification result
   */
  verifyOTP(identifier, otp, purpose = 'verification') {
    const otpData = this.getOTP(identifier);
    
    if (!otpData) {
      return {
        success: false,
        message: 'OTP not found or expired. Please request a new one.',
      };
    }

    if (otpData.verified) {
      return {
        success: false,
        message: 'OTP already verified. Please request a new one.',
      };
    }

    if (otpData.purpose !== purpose) {
      return {
        success: false,
        message: `Invalid OTP purpose. Expected: ${otpData.purpose}`,
      };
    }

    if (otpData.attempts >= otpData.maxAttempts) {
      this.otpStore.delete(identifier);
      return {
        success: false,
        message: 'Maximum attempts exceeded. Please request a new OTP.',
      };
    }

    otpData.attempts += 1;

    if (otpData.otp !== otp) {
      return {
        success: false,
        message: `Invalid OTP. ${otpData.maxAttempts - otpData.attempts} attempts remaining.`,
      };
    }

    // OTP is correct
    otpData.verified = true;
    return {
      success: true,
      message: 'OTP verified successfully!',
      identifier: otpData.identifier,
      purpose: otpData.purpose,
    };
  }

  /**
   * Send OTP via email
   * @param {string} email - Email address
   * @param {string} purpose - Purpose of OTP
   * @param {Object} options - Additional options
   * @returns {Object} - Result
   */
  async sendOTPEmail(email, purpose = 'verification', options = {}) {
    try {
      // This function now primarily creates the OTP. The sending is handled by the controller.
      const otpData = this.createOTP(email, 'email', purpose);

      return {
        success: true,
        message: `OTP sent to your email for ${purpose}`,
        otp: otpData.otp, // Return the OTP to be sent by the controller
        expiresIn: this.otpConfig.expiresIn,
      };
    } catch (error) {
      logger.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  /**
   * Get email template
   * @param {string} otp - OTP code
   * @param {string} purpose - Purpose of OTP
   * @returns {string} - HTML email template
   */
  getEmailTemplate(otp, purpose, data = {}) {
    const purposeMap = {
      verification: 'Verify your email address',
      login: 'Secure login verification',
      'reset-password': 'Password reset verification',
    };
    const { expiresIn = 5 } = data;
    const purposeText = purposeMap[purpose] || 'Verification';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .otp-box { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; border: 2px dashed #667eea; }
            .otp-code { font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; }
            .info { color: #6c757d; font-size: 14px; line-height: 1.6; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #adb5bd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">❤️ CharityConnect</div>
              <h2>${purposeText}</h2>
            </div>
            <p>Hello,</p>
            <p>You've requested to ${purposeText.toLowerCase()}. Use the OTP below to complete your request:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="info">This OTP is valid for <strong>${expiresIn} minutes</strong>. Do not share this code with anyone.</p>
            <p class="info">If you didn't request this, please ignore this email or contact our support team.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CharityConnect. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return { html };
  }

  /**
   * Send OTP via SMS
   * @param {string} phone - Phone number
   * @param {string} purpose - Purpose of OTP
   * @param {Object} options - Additional options
   * @returns {Object} - Result
   */
//   async sendOTPSMS(phone, purpose = 'verification', options = {}) {
//     try {
//       const otpData = this.createOTP(phone, 'phone', purpose);
      
//       const message = `Your ${purpose} OTP is: ${otpData.otp}. Valid for ${this.otpConfig.expiresIn / 60} minutes. Do not share this code.`;

//       await sendSMS({
//         to: phone,
//         message,
//         ...options,
//       });

//       return {
//         success: true,
//         message: `OTP sent to your phone for ${purpose}`,
//         otpId: otpData.id,
//         expiresIn: this.otpConfig.expiresIn,
//       };
//     } catch (error) {
//       logger.error('Error sending OTP SMS:', error);
//       throw new Error('Failed to send OTP SMS');
//     }
//   }

  /**
   * Resend OTP
   * @param {string} identifier - Email or phone number
   * @param {string} type - 'email' or 'phone'
   * @param {string} purpose - Purpose of OTP
   * @returns {Object} - Result
   */
  async resendOTP(identifier, type = 'email', purpose = 'verification') {
    this.otpStore.delete(identifier);
    
    if (type === 'email') {
      return await this.sendOTPEmail(identifier, purpose);
    } else {
      return await this.sendOTPSMS(identifier, purpose);
    }
  }

  /**
   * Clear expired OTPs
   */
  clearExpiredOTPs() {
    const now = Date.now();
    for (const [key, value] of this.otpStore.entries()) {
      if (now > value.expiresAt) {
        this.otpStore.delete(key);
      }
    }
  }

  /**
   * Get OTP status
   * @param {string} identifier - Email or phone number
   * @returns {Object} - OTP status
   */
  getOTPStatus(identifier) {
    const otpData = this.getOTP(identifier);
    if (!otpData) {
      return {
        exists: false,
        message: 'No active OTP found',
      };
    }

    return {
      exists: true,
      verified: otpData.verified,
      attempts: otpData.attempts,
      maxAttempts: otpData.maxAttempts,
      expiresIn: Math.floor((otpData.expiresAt - Date.now()) / 1000),
      purpose: otpData.purpose,
    };
  }
}

// Export singleton instance
const otpService = new OTPService();

setInterval(() => {
  otpService.clearExpiredOTPs();
}, 300000);

module.exports = otpService;