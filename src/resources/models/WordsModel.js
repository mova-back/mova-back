const { WordSchema } = require('../schemas/WordSchema');
const { assert, AppError } = require('../../root');
const { errorCodes } = require('../../error/errorCodes');

class WordsModel {
  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'Schema' });
  }

  static create(entity = {}) {
    assert.object(entity, { required: true });

    if (!entity.userId) {
      throw new AppError({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: "Please provide in action class 'userId' field",
        layer: 'Schema',
      });
    }

    return WordSchema.create(entity);
  }

  static async getList({ page, limit } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await WordSchema.find()
      .skip(page * limit)
      .limit(limit)
      .exec();

    const total = await WordSchema.find()
      .count((el) => el)
      .exec();

    return { result, total };
  }

  static async getById(id) {
    assert.mongoAutoId(id, { required: true });

    const data = await WordSchema.findById(id).exec();
    if (!data) throw this.errorEmptyResponse();
    return data;
  }

  static async update(id, entity = {}) {
    assert.mongoAutoId(id, { required: true });
    assert.object(entity, { required: true });

    return WordSchema.findByIdAndUpdate(id, entity).exec();
  }

  static remove(id) {
    assert.mongoAutoId(id, { required: true });

    return this.findByIdAndDelete(id).exec();
  }
}

module.exports = {
  WordsModel,
};