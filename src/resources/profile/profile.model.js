const Profile = require('./profile.schema');

const save = async (profile) => {
  return profile.save();
};

const findProfileByUserId = async (id) => {
  return Profile.findOne({ userId: id }).exec();
};

const updateRole = async (id, inputRole) => {
  return Profile.findOneAndUpdate({ userId: id }, { role: inputRole }, { new: true }).exec();
};

const addFollower = async (id, profileId) => {
  return Profile.findOneAndUpdate(
    { userId: id },
    { follows: [...profileId] },
    { new: true }
  ).exec();
};

const deleteFollower = async (id, profileId) => {
  return Profile.findOne({ userId: id }, async (err, profile) => {
    const newFollows = profile.follows.filter((followerId) => followerId !== profileId);

    // How we will catch error if userid doesnt have in follows array ??!
    return Profile.updateOne({ user_id: id }, { follows: newFollows });
  });
};

module.exports = {
  save,
  findProfileByUserId,
  updateRole,
  addFollower,
  deleteFollower
};
