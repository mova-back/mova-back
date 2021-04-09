const { WordSchema } = require('../schemas/WordSchema');
const { assert, AppError } = require('../../root');
const { errorCodes } = require('../../error/errorCodes');

class WordsModel {
  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'Schema' });
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    if (!entity.createdByUserId) {
      throw new AppError({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: "Please provide in action class 'userId' field",
        layer: 'Schema',
      });
    }

    return WordSchema.create(entity);
  }

  static async getReportList({ page, limit, search, orderBy } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });
    assert.string(search, { required: true });

    let result = {};
    const fieldWhere = {
      $and: [
        { complaints: { $exists: true, $type: 'array', $ne: [] } },
        { wordname: { $regex: search.replace('+', '.*'), $options: 'six' } },
      ],
    };

    if (orderBy.field && (orderBy.field === 'reportedAt' || orderBy.field === 'createdAt')) {
      result = await WordSchema.find(fieldWhere)
        .skip(page * limit)
        .limit(limit)
        .populate({ path: 'complaints', options: { sort: { reportedAt: `${orderBy.direction}` } } });
    }
    if (orderBy.field && orderBy.field === 'reports') {
      result = await WordSchema.find(fieldWhere)
        .sort([['complaints', `${orderBy.direction}`]])
        .skip(page * limit)
        .limit(limit)
        .populate('complaints');
    }

    const total = result.length;

    return { result, total };
  }

  static async getList({ page, limit, search, orderBy } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });
    assert.string(search, { required: true });

    // if complaints >> 5 => remove field in feed
    const result = await WordSchema.find({
      $and: [{ $expr: { $lt: [{ $size: '$complaints' }, 5] } }, { wordname: { $regex: search.replace('+', '.*'), $options: 'six' } }],
    })
      .sort([[`${orderBy.field}`, `${orderBy.direction}`]])
      .skip(page * limit)
      .limit(limit);

    const total = result.length;

    return { result, total };
  }

  static async findAndDeleteFields(entity = {}) {
    assert.object(entity, { required: true });

    WordSchema.find({}, entity);
  }

  static async getListByFilter(field, { page, limit, orderBy } = {}) {
    assert.array(field, { required: true });
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });
    assert.string(orderBy.field, { required: true });
    assert.string(orderBy.direction, { required: true });

    const result = await WordSchema.find({
      _id: { $in: field },
    })
      .sort([[`${orderBy.field.length}`, `${orderBy.direction}`]])
      .skip(page * limit)
      .limit(limit);

    const total = result.length;

    return { result, total };
  }

  static async getById(id) {
    assert.mongoAutoId(id, { required: true });

    const data = await WordSchema.findById(id);
    if (!data) throw this.errorEmptyResponse();
    return data;
  }

  static async findByIdAndUpdate(id, entity = {}) {
    assert.mongoAutoId(id, { required: true });
    assert.object(entity, { required: true });

    return WordSchema.findByIdAndUpdate(id, entity, { new: true });
  }

  static async remove(id) {
    assert.mongoAutoId(id, { required: true });

    return WordSchema.findByIdAndDelete(id);
  }
}

module.exports = {
  WordsModel,
};
