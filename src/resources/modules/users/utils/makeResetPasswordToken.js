const { assert } = require('../../../../root');
const { jwtSign } = require('../../../../utils/security/jwt');

const SECRET = require('../../../../config/AppConfig').tokenResetPasswordSecret;
const expiresIn = require('../../../../config/AppConfig').tokenResetPasswordExpiresIn;
const iss = require('../../../../config/AppConfig').jwtIss;
const { UserSchema } = require('../../../schemas/UserSchema');

/**
 * @return {Promise} string
 */
function makeResetPasswordToken(userEntity) {
  assert.object(userEntity, { required: true });
  assert.mongoAutoId(userEntity.id, { required: true });
  assert.validate(userEntity.email, UserSchema.schema.obj.email, { required: true });

  const config = {
    payload: {
      email: userEntity.email,
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

module.exports = { makeResetPasswordToken };
