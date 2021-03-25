const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    favoriteWords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'words',
      },
    ],
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
    createdWords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'words',
      },
    ],
  },
  { timestamps: true }
);

const ProfileSchema = mongoose.model('profile', schema);

module.exports = { ProfileSchema };
