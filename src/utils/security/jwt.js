const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const RefreshToken = require('../../resources/refreshToken/refreshToken.schema');

const refreshTokenModel = require('../../resources/refreshToken/refreshToken.model');
const profileModel = require('../../resources/profile/profile.model');

const { JWT_SECRET, ACCESS_EXP } = require('../../config');

const generateAccessTokenAndRefreshTokenForUser = async (user, jwtId) => {
  const refreshToken = new RefreshToken();

  refreshToken.userId = user.id;
  refreshToken.jwtId = jwtId;

  await refreshTokenModel.save(refreshToken);
  return refreshToken.id;
};

const getProfileRoleByUserId = async (id) => {
  return profileModel.findProfileByUserId(id);
};

const generateAccessTokenAndRefreshToken = async (user) => {
  const profile = await getProfileRoleByUserId(user.id);

  const payload = {
    userId: user.id,
    role: profile.role
  };

  const jwtId = uuid();

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXP,
    jwtid: jwtId, // needed for the refresh token, as a refresh token only points to one single unique token
    subject: user.id.toString()
  });

  const refreshToken = await generateAccessTokenAndRefreshTokenForUser(user, jwtId);

  return { accessToken, refreshToken };
};

const getJwtValueByKey = (token, key) => {
  const decodedToken = jwt.decode(token);
  return decodedToken[key];
};

const isValidToken = (token, ignoreExpiration) => {
  // ignoreExpiration

  return jwt.verify(
    token,
    JWT_SECRET,
    {
      ignoreExpiration
    },
    (err, user) => {
      if (err) {
        return false;
      }
      return user;
    }
  );
};

module.exports = {
  generateAccessTokenAndRefreshToken,
  getJwtValueByKey,
  isValidToken
};
