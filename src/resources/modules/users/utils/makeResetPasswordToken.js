const { assert } = require('../../../../root');
const { jwtSign } = require('../../../../utils/security/jwt');

const SECRET = require('../../../../config/AppConfig').tokenResetPasswordSecret;
const expiresIn = require('../../../../config/AppConfig').tokenResetPasswordExpiresIn;
const iss = require('../../../../config/AppConfig').jwtIss;
const { UserModel } = require('../../../models/UserModel');

/**
 * @return {Promise} string
 */
function makeResetPasswordToken(userEntity) {
  assert.object(userEntity, { required: true });
  assert.validate(userEntity.id, UserModel.schema.id, { required: true });
  assert.validate(userEntity.email, UserModel.schema.email, { required: true });

  const config = {
    payload: {
      email: userEntity.email,
      iss,
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id,
      expiresIn,
    },
  };

  return jwtSign(config.payload, SECRET, config.options);
}

module.exports = { makeResetPasswordToken };
