const userSchema = require('../user/user.schema');
const profileSchema = require('./profile.schema');

const getUserByUsername = async (username) => {
  return userSchema.findOne({ username: username.toString() }).exec();
};

const getProfileById = async (userId) => {
  return profileSchema.findOne({ user_id: userId }).exec();
};

const addFollower = async (id, inputUserNameID) => {
  return profileSchema.updateOne({ user_id: id }, { follows: inputUserNameID });
};

const deleteFollower = async (id, inputUserNameID) => {
  return profileSchema.findOne({ user_id: id }, async (err, profile) => {
    const newFollows = profile.follows.filter((userID) => userID === inputUserNameID);

    // How we will catch error if userid doesnt have in follows array ??!
    return profileSchema.updateOne({ user_id: id }, { follows: newFollows });
  });
};

module.exports = {
  getUserByUsername,
  getProfileById,
  addFollower,
  deleteFollower
};
