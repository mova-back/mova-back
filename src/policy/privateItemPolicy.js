const { AppError } = require('../root/abstract/AppError');
const { Assert: assert } = require('../root/abstract/Assert');
const { errorCodes } = require('../error/errorCodes');
const roles = require('../permissions/roles');

/**
 * @description check access to model by id
 * @public_access any user
 * @private_access owner, superadmin
 * @case get model by id
 * @returns {Promise} model
 */
module.exports = (model, currentUser) => {
  assert.object(model, { required: true });
  assert.object(currentUser, { required: true });

  return new Promise((resolve, reject) => {
    if (currentUser.role === roles.admin) return resolve(model);
    if (currentUser.id === model.userId) return resolve(model);
    if (!model.private) return resolve(model);
    if (model.private) {
      return reject(new AppError({ ...errorCodes.FORBIDDEN, message: `User ${currentUser.id} don't have access to model ${model.id}` }));
    }
    return reject(new AppError({ ...errorCodes.FORBIDDEN }));
  });
};
