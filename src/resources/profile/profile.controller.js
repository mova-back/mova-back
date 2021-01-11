const userModel = require('../user/user.model');
const profileModel = require('./profile.model');

const Profile = require('./profile.schema');

const { catchErrors } = require('../../middlewares/errorMiddleware');
const { NotFound, Unauthorized } = require('../../error');
const { getBearerTokenFromRequest } = require('../../utils/security/http');
const { isValidToken } = require('../../utils/security/jwt');

const { MR } = require('../../constants');

const followUser = catchErrors(async (req, res) => {
  const user = await userModel.findUserName(req.params.username);
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const profile = await profileModel.findProfileByUserId(user.id);
  // Наличие user гарантирует профайл, will be del( test throw )
  if (!profile) {
    throw new NotFound('Profile does not exist');
  }

  const currentProfile = await profileModel.addFollower(req.userId, profile.id);
  // Наличие user гарантирует профайл, will be del( test throw )
  if (!currentProfile) {
    throw new NotFound('Profile does not exist');
  }

  const result = Profile.toResponse(currentProfile);
  return res.status(200).json(result);
});

const unFollowUser = catchErrors(async (req, res) => {
  const user = await userModel.findUserName(req.params.username);
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const profile = await profileModel.findProfileByUserId(user.id);
  // Наличие user гарантирует профайл, will be del( test throw )
  if (!profile) {
    throw new NotFound('Profile does not exist');
  }

  const currentProfile = await profileModel.deleteFollower(req.userId, profile.id);
  // Наличие user гарантирует профайл, will be del( test throw )
  if (!currentProfile) {
    throw new NotFound('Profile does not exist');
  }

  const result = Profile.toResponse(currentProfile);
  return res.status(200).json(result);
});

const getProfile = catchErrors(async (req, res) => {
  const accessToken = getBearerTokenFromRequest(req);
  if (!isValidToken(accessToken)) {
    throw new Unauthorized('Token is not valid!');
  }
  const user = await userModel.findUserName(req.params.username);
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const profile = await profileModel.findProfileByUserId(user.id);
  const result = Profile.toResponse(profile);
  return res.status(200).json(result);
});

const promoteToModerator = catchErrors(async (req, res) => {
  const user = await userModel.findUserName(req.params.username);
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const profile = await profileModel.updateRole(user.id, MR);

  // throw already a moderator? or with front-end

  const result = Profile.toResponse(profile);
  return res.status(200).json(result);
});

module.exports = {
  promoteToModerator,
  getProfile,
  followUser,
  unFollowUser
};
