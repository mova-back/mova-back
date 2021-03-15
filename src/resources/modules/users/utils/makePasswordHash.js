const bcrypt = require('bcrypt');
const { assert } = require('../../../../root');

/**
 * @return {Promise} string
 */
async function makePasswordHash(password) {
  assert.string(password, { notEmpty: true });

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, hash) => {
      if (error) return reject(error);
      return resolve(hash);
    });
  });
}

module.exports = { makePasswordHash };
