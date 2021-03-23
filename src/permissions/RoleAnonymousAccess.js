class RoleAnonymousAccess {
  static get can() {
    return {
      'users:list': true,
      'users:get-by-id': true,
      'users:create': true,
      'users:confirm-registration': true,
      'users:confirm-email': true,
      'users:send-reset-password-email': true,
      'users:reset-password': true,

      'auth:login': true,
      'auth:refresh-tokens': true,

      'words:list': true,
      'words:get-by-id': true,
    };
  }
}

module.exports = RoleAnonymousAccess;
