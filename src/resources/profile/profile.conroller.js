const userModel = require('../user/user.model');

const Profile = require('./profile.schema');

const { catchErrors } = require('../../middlewares/errorMiddleware');
const { NotFound } = require('../../error');

const { MR } = require('../../constants');

// const getUserByUsername = async (username) => profileModel.getUserByUsername(username);
//
// const getProfileById = async (userId) => profileModel.getProfileById(userId);
//
// const addFollower = async (id, data) => {
//   const { username } = data;
//
//   if (!username) {
//     return null;
//   }
//
//   const inputUserName = await profileModel.getUserByUsername(username);
//
//   if (!inputUserName) {
//     return null;
//   }
//
//   return profileModel.addFollower(id, inputUserName.id);
// };
//
// const deleteFollower = async (id, data) => {
//   const { username } = data;
//
//   if (!username) {
//     return null;
//   }
//
//   const inputUserName = await profileModel.getUserByUsername(username);
//
//   if (!inputUserName) {
//     return null;
//   }
//
//   return profileModel.deleteFollower(id, inputUserName);
// };

const promoteToModerator = catchErrors(async (req, res) => {
  const user = await userModel.findUserName(req.params.username);
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const profile = await Profile.updateOne({ userId: user.id }, { role: MR }).exec();

  // throw already a moderator
  res.status(200).json(profile);
});

module.exports = {
  promoteToModerator
};
