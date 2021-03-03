const jwt = require('jsonwebtoken');
const errorCodes = require('../../error/errorCodes');

// const RefreshToken = require('../../resources/refreshToken/refreshToken.schema');

// const profileModel = require('../../resources/profile/profile.model');

function jwtSign(payload, SECRET, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (error, token) => {
      if (error)
        return reject(new Error({ ...errorCodes.TOKEN_NOT_SIGNED, message: error.message }));
      return resolve(token);
    });
  });
}

function jwtVerify(token, SECRET) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(new Error({ ...errorCodes.TOKEN_EXPIRED }));
        }
        return reject(new Error({ ...errorCodes.TOKEN_VERIFY, message: error.message }));
      }
      return resolve(decoded);
    });
  });
}

// const getJwtValueByKey = (token, key) => {
//   const decodedToken = jwt.decode(token);
//   return decodedToken[key];
// };
//
// const isValidToken = (token, ignoreExpiration) => {
//   // ignoreExpiration
//
//   return jwt.verify(
//     token,
//     JWT_SECRET,
//     {
//       ignoreExpiration
//     },
//     (err, user) => {
//       if (err) {
//         return false;
//       }
//       return user;
//     }
//   );
// };

module.exports = {
  jwtSign,
  jwtVerify
};
