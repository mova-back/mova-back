const { BaseAction } = require('../../../../root');
const { UserModel } = require('../../../models/UserModel');

class CancelEmailChangingAction extends BaseAction {
  static get accessTag() {
    return 'users:cancel-email-changing';
  }

  static async run(ctx) {
    const { currentUser } = ctx;
    await UserModel.update(currentUser.id, {
      newEmail: null,
      emailConfirmToken: null,
    });

    return this.result({ message: 'Email changing canceled!' });
  }
}

module.exports = { CancelEmailChangingAction };
