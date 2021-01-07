const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const RefreshToken = require('../../resources/refreshToken/refreshToken.schema');

const { JWT_SECRET, ACCESS_EXP } = require('../../config');

const generateAccessTokenAndRefreshTokenForUser = async (user, jwtId) => {
  const refreshToken = new RefreshToken();

  refreshToken.userId = user.id;
  refreshToken.jwtId = jwtId;

  await refreshToken.save();
  return refreshToken.id;
};

const generateAccessTokenAndRefreshToken = async (user) => {
  const payload = {
    userId: user.id
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
