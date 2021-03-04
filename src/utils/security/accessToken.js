const { TOKEN_ACCESS_SECRET, JWT_ISS, TOKEN_ACCESS_EXP } = require('../../config');
const { jwtSign } = require('./jwt');

const profileModel = require('../../resources/profile/profile.model');

async function makeAccessToken(userEntity) {
  const profile = await profileModel.findProfileByUserId(userEntity.id);

  const config = {
    payload: {
      // token type ?
      userId: userEntity.id,
      username: userEntity.username,
      userRole: profile.role,
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
