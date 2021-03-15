const { RequestRule, AppError, BaseAction } = require('../../../../root');

const { errorCodes } = require('../../../../error/errorCodes');
const { UserModel } = require('../../../models/UserModel');
const { UserSchema } = require('../../../schemas/UserSchema');
const { jwtVerify } = require('../../../../utils/security/jwt');
const config = require('../../../../config/AppConfig');

class ConfirmRegistrationAction extends BaseAction {
  static get accessTag() {
    return 'users:confirm-registration';
  }

  static get validationRules() {
    return {
      body: {
        emailConfirmToken: new RequestRule(UserSchema.schema.obj.emailConfirmToken, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const tokenData = await jwtVerify(ctx.body.emailConfirmToken, config.token.emailConfirm.secret);
    const { sub: userId } = tokenData;

    const user = await UserModel.getById(userId);
    if (user.emailConfirmToken !== ctx.body.emailConfirmToken) {
      throw new AppError({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN });
    }

    await UserModel.findByIdAndUpdate(userId, { isConfirmedRegistration: true, emailConfirmToken: null });
    console.log('User registration is confirmed', { userId, ctx: this.name });

    return this.result({ message: `User ${userId} registration is confirmed` });
  }
}

module.exports = { ConfirmRegistrationAction };
