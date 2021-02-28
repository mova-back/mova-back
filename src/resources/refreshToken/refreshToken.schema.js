const mongoose = require('mongoose');
const moment = require('moment');

const { REFRESH__EXP } = require('../../config/index');

const refreshTokenSchema = new mongoose.Schema({
  jwtId: { type: String },
  used: { type: Boolean, default: false },
  userId: { type: String },
  invalidated: { type: Boolean, default: false },
  expiryDate: { type: Date },
  createdAt: {
    type: Date,
    default: moment(),
    expires: REFRESH__EXP
  },
  updatedAt: {
    type: Date,
    default: moment()
  }
});

// expire 60 days

const RefreshToken = mongoose.model('refreshToken', refreshTokenSchema);

module.exports = RefreshToken;
