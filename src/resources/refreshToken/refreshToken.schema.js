const mongoose = require('mongoose');
const moment = require('moment');

const refreshTokenSchema = new mongoose.Schema({
  jwtId: { type: String },
  userId: { type: String },
  expiryDate: { type: Date },
  createdAt: {
    type: Date,
    default: moment()
  },
  updatedAt: {
    type: Date,
    default: moment()
  }
});

// TODO       userId: user.id,
//       ip: ctx.ip,
//       ua: ctx.headers['User-Agent'],
//       fingerprint: ctx.body.fingerprint,

// expire 60 days

const RefreshToken = mongoose.model('refreshToken', refreshTokenSchema);

module.exports = RefreshToken;
