const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    favorites: {
      type: Array,
      default: [],
      validate: {
        validator: (v) => Array.isArray(v),
        message: (prop) => `${prop.value} - Array`,
      },
    },
    name: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 3 && v.length <= 50,
        message: (prop) => `${prop.value} - string; min 3; max 50 chars`,
      },
    },
    location: {
      type: Number,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 8 && v.length <= 300,
        message: (prop) => `${prop.value} - string; min 3; max 300 chars;`,
      },
    },
  },
  { timestamps: true }
);

const ProfileSchema = mongoose.model('profile', schema);

module.exports = { ProfileSchema };
