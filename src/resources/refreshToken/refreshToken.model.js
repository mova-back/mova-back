const RefreshToken = require('./refreshToken.schema');

const findId = async (id) => {
  return RefreshToken.findOne({ _id: id }).exec();
};

const save = async (newRefreshToken) => {
  const refreshToken = new RefreshToken(newRefreshToken);
  await refreshToken.save();
};

const findJwtId = async (JwtId) => {
  return RefreshToken.findOne(JwtId).exec();
};

module.exports = {
  findId,
  save,
  findJwtId
};
