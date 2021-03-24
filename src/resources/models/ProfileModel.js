const { required } = require('joi');
const { assert } = require('../../root');
const { ProfileSchema } = require('../schemas/ProfileSchema');

class ProfileModel {
  static async create(entity = {}) {
    assert.object(entity, { required: true });

    return ProfileSchema.create(entity);
  }

  // TODO : assert integer id
  static async getByUserId(id) {
    return ProfileSchema.findOne({ user: id }).exec();
  }

  static async updateEntetyByField(field, entity) {
    assert.object(field, { required: true });
    assert.object(entity, { required: true });

    return ProfileSchema.findOneAndUpdate(field, entity);
  }

  static async getList(filter, { page, limit } = {}) {
    assert.string(filter, { required: true });
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await ProfileSchema.find({}, filter)
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
