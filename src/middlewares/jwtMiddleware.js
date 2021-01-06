const { getBearerTokenFromRequest } = require('../utils/security/http');
const { isValidToken } = require('../utils/security/jwt');
const { Unauthorized } = require('../error');

const auth = (req, resp, next) => {
  const token = getBearerTokenFromRequest(req);

  const data = isValidToken(token);
  if (!data) {
    throw new Unauthorized('JWT is not valid');
  } else {
    req.userId = data.userId;
  }

  next();
};

module.exports = {
  auth
};
