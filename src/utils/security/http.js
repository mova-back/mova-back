const { Unauthorized } = require('../../error');

const getBearerTokenFromRequest = (req) => {
  let authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw new Unauthorized('Authorization Header is not set');
  }

  if (authorizationHeader.startsWith('Bearer ')) {
    authorizationHeader = authorizationHeader.substring('Bearer '.length, authorizationHeader.length);
  }

  return authorizationHeader;
};

module.exports = { getBearerTokenFromRequest };
