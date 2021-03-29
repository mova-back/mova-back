const { errorCodes } = require('../../error/errorCodes');
const { assert, AppError } = require('../../root');
const { ReportSchema } = require('../schemas/ReportSchema');

class ReportModel {
  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'Schema' });
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    return ReportSchema.create(entity);
  }
}

module.exports = {
  ReportModel,
};
