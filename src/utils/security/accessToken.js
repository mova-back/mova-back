const { TOKEN_ACCESS_SECRET, JWT_ISS, TOKEN_ACCESS_EXP } = require('../../config');
const { jwtSign } = require('./jwt');

function makeAccessToken(userEntity) {
  const config = {
    payload: {
      // token type ?
      username: userEntity.name,
      userRole: userEntity.role,
      email: userEntity.email,
      iss: JWT_ISS
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id,
      expiresIn: TOKEN_ACCESS_EXP
    }
  };

  return jwtSign(config.payload, TOKEN_ACCESS_SECRET, config.options);
}

module.exports = {
  makeAccessToken
};
