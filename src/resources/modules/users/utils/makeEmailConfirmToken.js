const { assert } = require('../../../../root');
const { jwtSign } = require('../../../../utils/security/jwt');

const { appConfig } = require('../../../../config/AppConfig');

/**
 * @return {Promise} string
 */
function makeEmailConfirmToken(userEntity) {
  assert.object(userEntity, { required: true });

  const config = {
    payload: {
      email: userEntity.email,
      newEmail: userEntity.newEmail,
      iss: appConfig.jwtISS,
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id,
      expiresIn: appConfig.tokenEmailConfirmExpiresIn,
    },
  };

  return jwtSign(config.payload, appConfig.tokenEmailConfirmSecret, config.options);
}

module.exports = { makeEmailConfirmToken };
