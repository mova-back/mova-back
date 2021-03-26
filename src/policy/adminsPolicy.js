const { Assert: assert } = require('../root/abstract/Assert');
const { AppError } = require('../root/abstract/AppError');
const { errorCodes } = require('../error/errorCodes');

const roles = require('../permissions/roles');

/**
 * @access admin, moderator
 * @case update or delete model
 */
module.exports = (model, currentUser) => {
  assert.object(model, { required: true });
  assert.object(currentUser, { required: true });

  return new Promise((resolve, reject) => {
    // pass admin
    if (currentUser.role === roles.admin || roles.moderator) return resolve();
    return reject(new AppError({ ...errorCodes.FORBIDDEN }));
  });
};
