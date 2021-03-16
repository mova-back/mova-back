const { assert } = require('../../../../root');
const { jwtSign } = require('../../../../utils/security/jwt');

const SECRET = require('../../../../config/AppConfig').tokenEmailConfirmSecret;
const expiresIn = require('../../../../config/AppConfig').tokenEmailConfirmExpiresIn;
const iss = require('../../../../config/AppConfig').jwtIss;

/**
 * @return {Promise} string
 */
function makeEmailConfirmToken(userEntity) {
  assert.object(userEntity, { required: true });

  const config = {
    payload: {
      email: userEntity.email,
      newEmail: userEntity.newEmail,
      iss,
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id.toString(),
      expiresIn,
    },
  };

  return jwtSign(config.payload, SECRET, config.options);
}

module.exports = { makeEmailConfirmToken };
