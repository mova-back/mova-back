const { errorCodes } = require('../../error/errorCodes');
const { assert, AppError } = require('../../root');
const { ProfileSchema } = require('../schemas/ProfileSchema');

class ReportModel {
  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'Schema' });
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    return ProfileSchema.create(entity);
  }
}

module.exports = {
  ReportModel,
};
