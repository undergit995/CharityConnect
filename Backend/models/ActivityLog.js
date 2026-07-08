const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References your User model
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g., "User registered", "Login attempt"
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Allows saving any custom object/JSON data
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);