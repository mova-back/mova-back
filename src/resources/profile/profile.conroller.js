const profileModel = require('./profile.model');

const getUserByUsername = async (username) => profileModel.getUserByUsername(username);

const getProfileById = async (userId) => profileModel.getProfileById(userId);

const addFollower = async (id, data) => {
  const { username } = data;

  if (!username) {
    return null;
  }

  const inputUserName = await profileModel.getUserByUsername(username);

  if (!inputUserName) {
    return null;
  }

  return profileModel.addFollower(id, inputUserName.id);
};

const deleteFollower = async (id, data) => {
  const { username } = data;

  if (!username) {
    return null;
  }

  const inputUserName = await profileModel.getUserByUsername(username);

  if (!inputUserName) {
    return null;
  }

  return profileModel.deleteFollower(id, inputUserName);
};

module.exports = {
  getUserByUsername,
  getProfileById,
  addFollower,
  deleteFollower
};
