const { Assert: assert } = require('./Assert');
const { AppError } = require('./AppError');
const { errorCodes } = require('../../error/errorCodes');

class BaseModel {
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

    return this.schema.create(entity).exec();
  }

  static async getList({ page, limit } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await this.schema
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();

    const total = await this.schema
      .find()
      .count((el) => el)
      .exec();

    return { result, total };
  }

  static async getById(id) {
    assert.id(id, { required: true });

    const data = await this.schema.findById(id).exec();
    if (!data) throw this.errorEmptyResponse();
    return data;
  }
}

module.exports = { BaseModel };
