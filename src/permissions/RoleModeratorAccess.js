const BaseRoleAccess = require('./BaseRoleAccess');

class RoleModeratorAccess extends BaseRoleAccess {
  static get can() {
    return { ...this.basePermissions, 'words:update': true, 'words:delete': true };
  }
}

module.exports = RoleModeratorAccess;
