require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");


const isEmailConfigured = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('⚠️ Email credentials not configured. Email sending will be disabled.');
    return false;
  }
  return true;
};

// Create transporter only if credentials exist
const createTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add these options for better reliability
      tls: {
        rejectUnauthorized: false,
      },
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 100,
    });

    // Verify transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter error:', error);
        logger.error('Email transporter error:', error);
      }
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    logger.error('Failed to create email transporter:', error);
    return null;
  }
};

const transporter = createTransporter();


// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
    logger.error("Email transporter error:", error);
  }
});

module.exports = transporter;