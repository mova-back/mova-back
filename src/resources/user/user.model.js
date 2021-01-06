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

module.exports = {
  findUserName,
  findEmail,
  registerUser,
  findId
};
