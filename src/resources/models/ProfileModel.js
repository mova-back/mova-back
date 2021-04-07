const { errorCodes } = require('../../error/errorCodes');
const { assert, AppError } = require('../../root');
const { ProfileSchema } = require('../schemas/ProfileSchema');

class ProfileModel {
  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'Schema' });
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    return ProfileSchema.create(entity);
  }

  static async getByUserId(id) {
    return ProfileSchema.findOne({ userId: id }).exec();
  }

  static async updateEntetyByField(field, entity) {
    assert.object(field, { required: true });
    assert.object(entity, { required: true });

    const data = await ProfileSchema.findOneAndUpdate(field, entity);

    if (!data) throw this.errorEmptyResponse();

    return data;
  }

  static async getList(filter, { page, limit } = {}) {
    assert.string(filter, { required: true });
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await ProfileSchema.find({}, filter)
      .skip(page * limit)
      .limit(limit)
      .exec();

    const total = result.length;

    return { result, total };
  }

  static async findByIdAndDelete(field) {
    assert.object(field, { required: true });

    ProfileSchema.findOneAndDelete(field);
  }
}

module.exports = {
  ProfileModel,
};
