const { Unauthorized } = require('../../error');

const getRetrievedBearerTokenFromRequest = (req) => {
  let authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw new Unauthorized('Authorization Header is not set');
  }

  if (authorizationHeader.startsWith('Bearer ')) {
    authorizationHeader = authorizationHeader.substring(
      'Bearer '.length,
      authorizationHeader.length
    );
  }

  return authorizationHeader;
};

module.exports = { getRetrievedBearerTokenFromRequest };
