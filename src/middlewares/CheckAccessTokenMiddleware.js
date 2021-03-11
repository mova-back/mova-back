const { BaseMiddleware } = require('../root/BaseMiddleware');
const { errorCodes } = require('../error/errorCodes');
const { jwtVerify } = require('../utils/security/jwt');
const SECRET = require('../config/AppConfig').token.access.secret;
const roles = require('../permissions/roles');

class CheckAccessTokenMiddleware extends BaseMiddleware {
  async init() {
    // TODO
    console.log(`${this.constructor.name} initialized...`);
  }

  handler() {
    return (req, res, next) => {
      const authorization = req.headers['authorization'] || req.headers['Authorization'];
      const bearer = authorization && authorization.startsWith('Bearer ') ? authorization : null;
      const token = bearer ? bearer.split('Bearer ')[1] : null;

      // set default meta data
      req.currentUser = Object.freeze({
        id: null,
        name: null,
        role: roles.anonymous,
        email: null,
        expiresIn: null,
      });

      if (token) {
        // TODO return
        jwtVerify(token, SECRET)
          .then((tokenData) => {
            // set actual current user
            req.currentUser = Object.freeze({
              id: tokenData.sub,
              name: tokenData.username,
              role: tokenData.userRole,
              email: tokenData.email,
              expiresIn: Number(tokenData.exp),
            });

            next();
          })
          .catch((error) => {
            if (error.code === errorCodes.TOKEN_EXPIRED.code) {
              // TODO : pass request if token is not valid
              next();
            } else {
              next(error);
            }
          });
      }
      next();
    };
  }
}

module.exports = { CheckAccessTokenMiddleware };
