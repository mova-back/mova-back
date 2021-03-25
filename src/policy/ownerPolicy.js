const { Assert: assert } = require('../root/abstract/Assert');
const { AppError } = require('../root/abstract/AppError');
const { errorCodes } = require('../error/errorCodes');

const roles = require('../permissions/roles');

/**
 * @description model userId === current user id
 * @access owner, superadmin
 * @case update or delete model
 */
module.exports = (model, currentUser) => {
  assert.object(model, { required: true });
  assert.object(currentUser, { required: true });

  return new Promise((resolve, reject) => {
    // pass admin
    if (currentUser.role === roles.admin) return resolve();
    // pass owner
    if (currentUser.id === model.userId || model.createdByUserId) return resolve();
    // else reject
    return reject(new AppError({ ...errorCodes.FORBIDDEN }));
  });
};
