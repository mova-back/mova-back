const { BaseAction } = require('../../../../root');

const { UserModel } = require('../../../models/UserModel');

class GetCurrentUserAction extends BaseAction {
  static get accessTag() {
    return 'users:get-current-user';
  }

  static async run(ctx) {
    const { currentUser } = ctx;
    const data = await UserModel.getCurrentUser(currentUser.id);

    return this.result({ data });
  }
}

module.exports = { GetCurrentUserAction };
