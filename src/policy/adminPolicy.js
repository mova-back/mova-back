const { Assert: assert } = require('../root/abstract/Assert');
const { AppError } = require('../root/abstract/AppError');
const { errorCodes } = require('../error/errorCodes');

const roles = require('../permissions/roles');

/**
 * @access admin
 */
module.exports = (currentUser) => {
  assert.object(currentUser, { required: true });

  return new Promise((resolve, reject) => {
    // pass admin
    if (currentUser.role === roles.admin) return resolve();
    return reject(new AppError({ ...errorCodes.FORBIDDEN }));
  });
};
