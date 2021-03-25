const { BaseMiddleware } = require('../root');
const { errorCodes } = require('../error/errorCodes');
const { jwtVerify } = require('../utils/security/jwt');
const SECRET = require('../config/AppConfig').tokenAccesSecret;
const roles = require('../permissions/roles');

class CheckAccessTokenMiddleware extends BaseMiddleware {
  async init() {
    // TODO: log
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
        return jwtVerify(token, SECRET)
          .then((tokenData) => {
            console.log('TOKEN DATA', tokenData);
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
              /**
               * pass request if token is not valid
               * in this case security service will consider that request as anonymous request
               */
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
