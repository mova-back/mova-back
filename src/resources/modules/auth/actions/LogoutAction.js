const { AppError, errorCodes } = require('../../../../root');
const { BaseAction } = require('../../../../root');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');

class LogoutAction extends BaseAction {
  static async run(ctx) {
    // take refresh token from any possible source
    const refreshToken = ctx.cookies.refreshToken || ctx.body.refreshToken;
    if (!refreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' });
    }
    // TODO : test remove all tokens or one
    await RefreshSessionModel.removeToken(refreshToken);

    return this.result({ message: 'User is logged out from current session.' });
  }
}

module.exports = { LogoutAction };
