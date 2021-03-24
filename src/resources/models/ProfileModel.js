const { assert } = require('../../root');
const { ProfileSchema } = require('../schemas/ProfileSchema');

class ProfileModel {
  static async create(entity = {}) {
    assert.object(entity, { required: true });

    return ProfileSchema.create(entity);
  }

  static async getList({ page, limit } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await ProfileSchema.find()
      .skip(page * limit)
      .limit(limit)
      .exec();

    const total = await ProfileSchema.find()
      .count((el) => el)
      .exec();

    return { result, total };
  }
}

module.exports = {
  ProfileModel,
};
