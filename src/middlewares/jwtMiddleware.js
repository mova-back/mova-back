const { getBearerTokenFromRequest } = require('../utils/security/http');
const { isValidToken } = require('../utils/security/jwt');
const { Unauthorized } = require('../error');

const authByRole = (role) => (req, resp, next) => {
  const token = getBearerTokenFromRequest(req);

  const data = isValidToken(token);
  if (data.role === role) {
    req.userId = data.userId;
    next();
  } else {
    throw new Unauthorized('JWT is not valid');
  }
};

module.exports = {
  authByRole
};
