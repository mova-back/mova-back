const { getBearerTokenFromRequest } = require('../utils/security/http');
const { jwtVerify } = require('../utils/security/jwt');
const { Unauthorized } = require('../error');

const { TOKEN_ACCESS_SECRET } = require('../config/index');

const authByRole = (listRole) => async (req, resp, next) => {
  const token = getBearerTokenFromRequest(req);

  const currentUser = await jwtVerify(token, TOKEN_ACCESS_SECRET);

  // TODO userid ?
  if (listRole.filter((role) => role === currentUser.userRole)) {
    req.userId = currentUser.userId;
    next();
  } else {
    throw new Unauthorized('JWT is not valid / Role access denied ');
  }
};

module.exports = {
  authByRole
};
