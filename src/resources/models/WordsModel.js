const { WordSchema } = require('../schemas/WordSchema');
const { assert } = require('../../root');
const { AppError } = require('../../root');
const { errorCodes } = require('../../error/errorCodes');

class WordsModel {
  static async getWordsList({ page, limit } = {}) {
    console.log('page', page);
    console.log('limit', limit);
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await WordSchema.find()
      .skip(page * limit)
      .limit(limit);

    const total = await WordSchema.find().count((el) => el);

    return { result, total };
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    if (!entity.userId) {
      throw new AppError({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: "Please provide in action class 'userId' field",
        layer: 'Model',
      });
    }

    return WordSchema.create(entity);
  }
}

module.exports = {
  WordsModel,
};
