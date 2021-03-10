const RefreshToken = require('./refreshToken.schema');
const RefreshSchema = require('./refreshToken.schema');

const getByRefreshToken = async (refreshToken) => {
  return RefreshToken.findOne({ refreshToken }).exec();
};

const create = async (refreshToken) => {
  await RefreshSchema.create(refreshToken);
};

const findJwtId = async (jwtId) => {
  return RefreshToken.findOne({ jwtId }).exec();
};

const deleteRefreshToken = async (refreshToken) => {
  return RefreshToken.findOneAndDelete({ refreshToken });
};

module.exports = {
  getByRefreshToken,
  create,
  findJwtId,
  deleteRefreshToken,
};
