const { AppError } = require('../root/abstract/AppError');
const { Assert: assert } = require('../root/abstract/Assert');
const { errorCodes } = require('../error/errorCodes');
const roles = require('../permissions/roles');

/**
 * @description model id === current user id
 * @access owner, admin, moderator
 * @case update user model
 */
module.exports = (model, currentUser) => {
  assert.object(model, { required: true });
  assert.object(currentUser, { required: true });

  return new Promise((resolve, reject) => {
    if (currentUser.role === roles.admin || roles.moderator) return resolve();
    if (currentUser.id === model.id) return resolve();
    return reject(new AppError({ ...errorCodes.FORBIDDEN }));
  });
};
