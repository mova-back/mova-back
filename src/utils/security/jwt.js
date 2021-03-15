const jwt = require('jsonwebtoken');
const errorCodes = require('../../error/errorCodes');
const { AppError } = require('../../root/AppError');
const { Assert: assert } = require('../../root/Assert');

// const RefreshToken = require('../../resources/refreshToken/refreshToken.schema');

// const profileModel = require('../../resources/profile/profile.model');

function jwtSign(payload, SECRET, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (error, token) => {
      if (error) return reject(new Error({ ...errorCodes.TOKEN_NOT_SIGNED, message: error.message }));
      return resolve(token);
    });
  });
}

function jwtVerify(token, SECRET) {
  assert.string(token, { notEmpty: true });
  assert.string(SECRET, { notEmpty: true });

  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(new AppError({ ...errorCodes.TOKEN_EXPIRED }));
        }
        return reject(new AppError({ ...errorCodes.TOKEN_VERIFY, message: error.message }));
      }
      return resolve(decoded);
    });
  });
}

module.exports = {
  jwtSign,
  jwtVerify,
};
