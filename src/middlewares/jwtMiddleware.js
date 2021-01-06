const { getBearerTokenFromRequest } = require('../utils/security/http');
const { isValidToken } = require('../utils/security/jwt');
const { Unauthorized } = require('../error');

const auth = (req, resp, next) => {
  const token = getBearerTokenFromRequest(req);

  if (!isValidToken(token)) {
    throw new Unauthorized('JWT is not valid');
  }

  next();
};

module.exports = {
  auth
};
