const roles = require('./roles');
const RoleAdminAccess = require('./RoleAdminAccess');
const RoleModeratorAccess = require('./RoleModeratorAccess');
const RoleUserAccess = require('./RoleUserAccess');
const RoleAnonymousAccess = require('./RoleAnonymousAccess');

module.exports = {
  [roles.admin]: {
    ...RoleAdminAccess.can,
    ...RoleModeratorAccess.can,
    ...RoleUserAccess.can,
    ...RoleAnonymousAccess.can,
  },
  [roles.moderator]: RoleModeratorAccess.can,
  [roles.user]: RoleUserAccess.can,
  [roles.anonymous]: RoleAnonymousAccess.can,
};
