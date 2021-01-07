const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    role: { type: String, default: 'USER_ROLE' },
    user_id: { type: String },
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
