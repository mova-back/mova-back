class BaseRoleAccess {
  static get basePermissions() {
    return {
      'users:list': true,
      'users:update': true,
      'users:get-by-id': true,
      'users:remove': true,
      'users:get-current-user': true,

      'users:change-password': true,
      'users:change-email': true,
      'users:confirm-email': true,
      'users:resend-confirm-new-email-token': true,
      'users:send-reset-password-email': true,
      'users:reset-password': true,

      'words:all': true,

      'auth:logout': true,

      'profiles:all': true,
    };
  }
}

module.exports = BaseRoleAccess;
