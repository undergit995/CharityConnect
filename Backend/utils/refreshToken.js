const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "CharityConnectSecretKey";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "CharityConnectRefreshSecretKey";

const generateTokens = (user, existingRefreshToken = null) => {
  const payload = {
    id: user._id,
    userId: user._id,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
    tokenVersion: user.tokenVersion || 0,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' });

  
  const refreshToken = existingRefreshToken
    ? existingRefreshToken
    : jwt.sign(
        { id: user._id, userId: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

module.exports = generateTokens