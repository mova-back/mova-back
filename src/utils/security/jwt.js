const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const moment = require('moment');
const RefreshToken = require('../../resources/refreshToken/refreshToken.schema');

const { SECRET_JWT_KEY } = require('../../config');

const generateAccessTokenAndRefreshTokenForUser = async (user, jwtId) => {
  const refreshToken = new RefreshToken();

  // TODO we need connection by id or something (by populate) ?
  refreshToken.userId = user.id;
  refreshToken.jwtId = jwtId;

  // expiry 10 days
  refreshToken.expiryDate = moment().add(10, 'd').toDate();

  await refreshToken.save();
  return refreshToken.id;
};

const generateAccessTokenAndRefreshToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  const jwtId = uuid();

  const accessToken = jwt.sign(payload, SECRET_JWT_KEY, {
    expiresIn: '5m',
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
  try {
    return jwt.verify(token, SECRET_JWT_KEY, {
      ignoreExpiration
    });
  } catch (err) {
    return false;
  }
};

const isRefreshTokenExpired = (refreshToken) => {
  return moment().isAfter(refreshToken.expiryDate);
};

module.exports = {
  generateAccessTokenAndRefreshToken,
  getJwtValueByKey,
  isValidToken,
  isRefreshTokenExpired
};
