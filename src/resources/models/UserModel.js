const { UserSchema } = require('../schemas/UserSchema');
const { assert, AppError } = require('../../root');
const { errorCodes } = require('../../error/errorCodes');

class UserModel {
  static async getCount(id) {
    return UserSchema.find(id)
      .count((el) => el)
      .exec();
  }

  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'model' });
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    return UserSchema.create(entity);
  }

  static async findByIdAndUpdate(id, entity = {}) {
    assert.mongoAutoId(id, { required: true });
    assert.object(entity, { required: true });

    return UserSchema.findByIdAndUpdate(id, entity, { new: true });
  }

  static async deleteMany(id) {
    await UserSchema.deleteMany(id).exec();
  }

  static async findByIdAndDelete(id) {
    await UserSchema.findByIdAndDelete({ id }).exec();
  }

  static async getById(id) {
    return UserSchema.findOne({ _id: id }).exec();
  }

  static async getByEmail(email) {
    assert.validate(email, UserSchema.schema.obj.email, { required: true });

    const data = await UserSchema.findOne({ email });
    if (!data) throw this.errorEmptyResponse();
    return data;
  }

  static async isEmailExist(email) {
    assert.validate(email, UserSchema.schema.obj.email, { required: true });

    const data = await UserSchema.findOne({ email });
    return Boolean(data);
  }

  static async getList({ page, limit, search, orderBy } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });
    assert.string(search, { required: true });

    const result = await UserSchema.find({ username: { $regex: search.replace('+', '.*'), $options: 'six' } })
      .sort([[`${orderBy.field}`, `${orderBy.direction}`]])
      .skip(page * limit)
      .limit(limit);
    const total = result.length;

    return { result, total };
  }

  static async getCurrentUser(id) {
    // TODO : add schema id
    // assert.validate(id, UserModel.schema.obj.id, { required: true });
    const data = await UserSchema.findById(id).populate('profile').exec();

    // TODO : delete fields in response

    // delete data.passwordHash;
    // delete data.emailConfirmToken;
    // delete data.resetPasswordToken;

    return data;
  }
}

module.exports = {
  UserModel,
};
