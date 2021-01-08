const mongoose = require('mongoose');

const { PRE_UR } = require('../../constants');

const profileSchema = new mongoose.Schema(
  {
    role: { type: String, default: PRE_UR },
    userId: { type: String },
    follows: []
  },
  { timestamps: true }
);

profileSchema.statics.toResponse = (profile) => {
  const { role, user_id, follows } = profile;
  return { role, user_id, follows };
};

const Profile = mongoose.model('profiles', profileSchema);

module.exports = Profile;
