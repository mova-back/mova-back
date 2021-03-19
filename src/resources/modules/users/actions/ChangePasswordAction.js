const { RequestRule, BaseAction } = require('../../../../root');

const { UserModel } = require('../../../models/UserModel');
const { UserSchema } = require('../../../schemas/UserSchema');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');
const { makePasswordHash } = require('../utils/makePasswordHash');
const { checkPassword } = require('../../../../utils/security/checkPassword');

class ChangePasswordAction extends BaseAction {
  static get accessTag() {
    return 'users:change-password';
  }

  static get validationRules() {
    return {
      body: {
        oldPassword: new RequestRule(UserSchema.schema.obj.passwordHash, { required: true }),
        newPassword: new RequestRule(UserSchema.schema.obj.passwordHash, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;
    console.log(currentUser);

    const user = await UserModel.getById(currentUser.id);

    await checkPassword(ctx.body.oldPassword, user.passwordHash);
    const newHash = await makePasswordHash(ctx.body.newPassword);

    await Promise.all([
      RefreshSessionModel.removeMany(currentUser.id), // Changing password will remove all logged in refresh sessions
      UserModel.findByIdAndUpdate(currentUser.id, { passwordHash: newHash }),
    ]);

    return this.result({ message: 'Password changed' });
  }
}

module.exports = { ChangePasswordAction };
