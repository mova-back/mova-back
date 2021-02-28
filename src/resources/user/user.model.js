const User = require('./user.schema');

const findEmail = async (email) => {
  return User.findOne({ email }).exec();
};

const findUserName = async (username) => {
  return User.findOne({ username }).exec();
};

const findId = async (id) => {
  return User.findOne({ _id: id }).exec();
};

const findAndUpdate = async (id, data) => {
  return User.findOneAndUpdate({ _id: id }, data, { new: true });
};

const registerUser = async (data) => {
  return User.create(data);
};

const updateVerifyStatus = async (email, verifyStatus) => {
  await User.updateOne({ email }, { emailVerified: verifyStatus });
};

module.exports = {
  findUserName,
  findEmail,
  registerUser,
  findId,
  findAndUpdate,
  updateVerifyStatus
};
