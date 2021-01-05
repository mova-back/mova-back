const RefreshToken = require('./refreshToken.schema');

const findId = async (id) => {
  return RefreshToken.findOne({ _id: id }).exec();
};

const save = async (newRefreshToken) => {
  const refreshToken = new RefreshToken(newRefreshToken);
  await refreshToken.save();
};

module.exports = {
  findId,
  save
};
