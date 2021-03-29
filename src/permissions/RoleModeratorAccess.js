const BaseRoleAccess = require('./BaseRoleAccess');

class RoleModeratorAccess extends BaseRoleAccess {
  static get can() {
    return { ...this.basePermissions, 'reports:all': true };
  }
}

module.exports = RoleModeratorAccess;
