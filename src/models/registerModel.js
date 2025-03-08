const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
});

module.exports = mongoose.model('User', UserSchema);