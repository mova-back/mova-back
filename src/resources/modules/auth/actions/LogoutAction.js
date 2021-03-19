const { AppError, BaseAction, RequestRule } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');
const { AuthValidationSchema } = require('../../../schemas/AuthValidationSchema');

class LogoutAction extends BaseAction {
  static get accessTag() {
    return 'auth:logout';
  }

  static get validationRules() {
    return {
      body: {
        refreshToken: new RequestRule(AuthValidationSchema.schema.refreshToken),
      },
      cookies: {
        refreshToken: new RequestRule(AuthValidationSchema.schema.refreshToken),
      },
    };
  }

  static async run(ctx) {
    // take refresh token from any possible source
    const { refreshToken } = ctx.cookies;
    if (!refreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' });
    }
    // TODO : test remove all tokens or one
    await RefreshSessionModel.removeToken(refreshToken);

    return this.result({ message: 'User is logged out from current session.' });
  }
}

module.exports = { LogoutAction };
