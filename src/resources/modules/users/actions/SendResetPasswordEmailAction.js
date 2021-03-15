const { RequestRule, BaseAction } = require('../../../../root');
const { emailAgent } = require('../../RootProvider');
const { UserSchema } = require('../../../schemas/UserSchema');
const { UserModel } = require('../../../models/UserModel');
const { makeResetPasswordToken } = require('../utils/makeResetPasswordToken');
const { ResetPasswordEmail } = require('../utils/emails/ResetPasswordEmail');

/**
 * 1) get email from body request
 * 2) find user in DB by email
 * 3) generate and store resetPasswordToken to DB
 * 4) send reset email
 */
class SendResetPasswordEmailAction extends BaseAction {
  static get accessTag() {
    return 'users:send-reset-password-email';
  }

  static get validationRules() {
    return {
      body: {
        email: new RequestRule(UserSchema.schema.obj.email, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const user = await UserModel.getByEmail(ctx.body.email);
    const resetPasswordToken = await makeResetPasswordToken(user);
    await UserModel.update(user.id, { resetPasswordToken });

    await emailAgent.send(new ResetPasswordEmail({ to: user.email, resetPasswordToken }));

    return this.result({ message: 'Reset password email delivered' });
  }
}

module.exports = { SendResetPasswordEmailAction };
