const RefreshToken = require('./refreshToken.schema');

const findId = async (id) => {
  return RefreshToken.findOne({ _id: id }).exec();
};

const save = async (refreshToken) => {
  await refreshToken.save();
};

const findJwtId = async (JwtId) => {
  return RefreshToken.findOne(JwtId).exec();
};

const deleteRefreshToken = async (id) => {
  return RefreshToken.findByIdAndDelete(id);
};

module.exports = {
  findId,
  save,
  findJwtId,
  deleteRefreshToken
};
