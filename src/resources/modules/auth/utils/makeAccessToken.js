const { assert } = require('../../../../root');

const { jwtSign } = require('../../../../utils/security/jwt');

const SECRET = require('../../../../config/AppConfig').tokenAccesSecret;
const expiresIn = require('../../../../config/AppConfig').tokenAccesExpiresIn;
const iss = require('../../../../config/AppConfig').jwtISS;

/**
 * @return {Promise} string
 */
async function makeAccessToken(userEntity) {
  assert.object(userEntity, { required: true });

  const config = {
    payload: {
      username: userEntity.name,
      userRole: userEntity.role,
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

module.exports = { makeAccessToken };
