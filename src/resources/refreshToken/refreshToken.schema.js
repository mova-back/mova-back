const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    jwtId: { type: String },
    used: { type: Boolean, default: false },
    userId: { type: String },
    invalidated: { type: Boolean, default: false },
    expiryDate: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model('refreshToken', refreshTokenSchema);

module.exports = RefreshToken;
