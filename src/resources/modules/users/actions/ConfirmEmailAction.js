const { AppError, RequestRule, BaseAction } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');
const { UserModel } = require('../../../models/UserModel');
const { UserSchema } = require('../../../schemas/UserSchema');
const { jwtVerify } = require('../../../../utils/security/jwt');
const config = require('../../../../config/AppConfig');
// TODO : add logger

class ConfirmEmailAction extends BaseAction {
  static get accessTag() {
    return 'users:confirm-email';
  }

  static get validationRules() {
    return {
      body: {
        emailConfirmToken: new RequestRule(UserSchema.schema.obj.emailConfirmToken, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const tokenData = await jwtVerify(ctx.body.emailConfirmToken, config.tokenEmailConfirmSecret);
    const { sub: userId } = tokenData;

    const user = await UserModel.getById(userId);
    const { newEmail } = user;
    if (user.emailConfirmToken !== ctx.body.emailConfirmToken) {
      throw new AppError({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN });
    }
    await UserModel.findByIdAndUpdate(userId, {
      email: newEmail,
      newEmail: null,
      emailConfirmToken: null,
    });
    console.log('User email confirmed', { userId, newEmail, ctx: this.name });

    return this.result({ message: `${newEmail} confirmed` });
  }
}

module.exports = { ConfirmEmailAction };
