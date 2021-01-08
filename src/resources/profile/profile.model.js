// const userSchema = require('../user/user.schema');
const profileSchema = require('./profile.schema');

// const getUserByUsername = async (username) => {
//   return userSchema.findOne({ username: username.toString() }).exec();
// };
//
// const addFollower = async (id, inputUserNameID) => {
//   return profileSchema.updateOne({ user_id: id }, { follows: inputUserNameID });
// };
//
// const deleteFollower = async (id, inputUserNameID) => {
//   return profileSchema.findOne({ user_id: id }, async (err, profile) => {
//     const newFollows = profile.follows.filter((userID) => userID === inputUserNameID);
//
//     // How we will catch error if userid doesnt have in follows array ??!
//     return profileSchema.updateOne({ user_id: id }, { follows: newFollows });
//   });
// };

const save = async (profile) => {
  return profile.save();
};

const findProfileByUserId = async (id) => {
  return profileSchema.findOne({ userId: id }).exec();
};

module.exports = {
  save,
  findProfileByUserId
};
