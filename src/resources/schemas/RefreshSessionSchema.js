const mongoose = require('mongoose');
const isIP = require('validator/lib/isIP');
const isUUID = require('validator/lib/isUUID');

const schema = new mongoose.Schema(
  {
    // TODO :connect to userSchema
    userId: { type: String, required: true },
    refreshToken: {
      type: String,
      required: true,
      validate: {
        validator: (v) => isUUID(v),
        message: (prop) => `${prop.value} - UUID`,
      },
    },
    fingerprint: {
      type: String,
      // required: true,
      validate: {
        validator: (v) => typeof v === 'string' && v.length <= 200,
        message: (prop) => `${prop.value} - string; max 200 chars`,
      },
    },
    ip: {
      type: String,
      required: true,
      validate: {
        validator: (v) => isIP(v),
        message: (prop) => `${prop.value} - string; IP`,
      },
    },
    expiresIn: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => Boolean(v) && Number.isInteger(Number(v)),
        message: (prop) => `${prop.value} - number`,
      },
    },
    ua: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length <= 200,
        message: (prop) => `${prop.value} - string; max 200 chars`,
      },
    },
  },
  { timestamps: true }
);

const RefreshSessionSchema = mongoose.model('refresh_sessions', schema);

module.exports = { RefreshSessionSchema };
