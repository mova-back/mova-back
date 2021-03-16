const { AppError, RequestRule, BaseAction } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');
const { makePasswordHash } = require('../utils/makePasswordHash');
const { jwtVerify } = require('../../../../utils/security/jwt');
const { UserSchema } = require('../../../schemas/UserSchema');
const { UserModel } = require('../../../models/UserModel');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');
const config = require('../../../../config/AppConfig');

/**
 * 1) verify resetPasswordToken
 * 2) compare existing resetPasswordToken from DB and resetPasswordToken from request
 * 3) make hash from new password
 * 4) update user entity in DB with new hash, reset resetPasswordToken and refreshTokensMap
 */
class ResetPasswordAction extends BaseAction {
  static get accessTag() {
    return 'users:reset-password';
  }

  static get validationRules() {
    return {
      body: {
        resetPasswordToken: new RequestRule(UserSchema.schema.obj.resetPasswordToken, { required: true }),
        password: new RequestRule(UserSchema.schema.obj.passwordHash, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const tokenData = await jwtVerify(ctx.body.resetPasswordToken, config.tokenResetPasswordSecret);
    const tokenUserId = tokenData.sub;
    const user = await UserModel.getById(tokenUserId);

    if (user.resetPasswordToken !== ctx.body.resetPasswordToken) {
      throw new AppError({ ...errorCodes.WRONG_RESET_PASSWORD_TOKEN });
    }
    const passwordHash = await makePasswordHash(ctx.body.password);

    await Promise.all([
      UserModel.findByIdAndUpdate(tokenUserId, { passwordHash, resetPasswordToken: '' }),
      RefreshSessionModel.removeMany({ userId: tokenUserId }),
    ]);

    return this.result({ message: 'Reset password process was successfully applied' });
  }
}

module.exports = { ResetPasswordAction };
