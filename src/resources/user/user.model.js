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

const registerUser = async (data) => {
  return User.create(data);
};

const findAndUpdate = async (id, data) => {
  return User.findOneAndUpdate({ _id: id }, data, { new: true });
};

module.exports = {
  findUserName,
  findEmail,
  registerUser,
  findId,
  findAndUpdate
};
