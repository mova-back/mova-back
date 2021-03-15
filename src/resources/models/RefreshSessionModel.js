const { RefreshSessionSchema } = require('../schemas/RefreshSessionSchema');
const { assert } = require('../../root');

class RefreshSessionModel {
  static getCount(id) {
    return RefreshSessionSchema.find(id)
      .count((el) => el)
      .exec();
  }

  static create(token) {
    return RefreshSessionSchema.create(token);
  }

  static deleteMany(id) {
    RefreshSessionSchema.deleteMany(id).exec();
  }

  static removeToken(refreshToken) {
    RefreshSessionSchema.deleteOne({ refreshToken }).exec();
  }

  static getByRefreshToken(refreshToken) {
    assert.string(refreshToken, { notEmpty: true });

    return RefreshSessionSchema.findOne({ refreshToken }).exec();
  }

  // const getByRefreshToken = async (refreshToken) => {
  //   return RefreshToken.findOne({ refreshToken }).exec();
  // };

  // const create = async (refreshToken) => {
  //   await RefreshSchema.create(refreshToken);
  // };

  // const findJwtId = async (jwtId) => {
  //   return RefreshToken.findOne({ jwtId }).exec();
  // };

  // const deleteRefreshToken = async (refreshToken) => {
  //   return RefreshToken.findOneAndDelete({ refreshToken });
}

module.exports = {
  RefreshSessionModel,
};
