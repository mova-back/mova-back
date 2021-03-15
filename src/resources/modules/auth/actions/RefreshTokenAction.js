const ms = require('ms');
const { CookieEntity, AppError } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');

const { BaseAction } = require('../../../../root');
const { addRefreshSession } = require('../utils/addRefreshSession');
const { verifyRefreshSession } = require('../utils/verifyRefreshSession');
const { makeAccessToken } = require('../utils/makeAccessToken');
const { RefreshSessionEntity } = require('../utils/RefreshSessionEntity');
const { UserModel } = require('../../../models/UserModel');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');
const config = require('../../../../config/AppConfig');

class RefreshTokensAction extends BaseAction {
  static async run(ctx) {
    // take refresh token from any possible source
    const reqRefreshToken = ctx.cookies.refreshToken || ctx.body.refreshToken;
    const reqFingerprint = ctx.body.fingerprint;

    if (!reqRefreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' });
    }

    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.tokenRefreshExpiresIn);
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000, 10);

    const oldRefreshSession = await RefreshSessionModel.getByRefreshToken(reqRefreshToken);
    await RefreshSessionModel.removeToken(reqRefreshToken);
    await verifyRefreshSession(new RefreshSessionEntity(oldRefreshSession), reqFingerprint);
    const user = await UserModel.GetById(oldRefreshSession.userId);

    const newRefreshSession = new RefreshSessionEntity({
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: reqFingerprint,
      expiresIn: refTokenExpiresInMilliseconds,
    });

    await addRefreshSession(newRefreshSession);

    return this.result({
      data: {
        accessToken: await makeAccessToken(user),
        refreshToken: newRefreshSession.refreshToken,
      },
      cookies: [
        new CookieEntity({
          name: 'refreshToken',
          value: newRefreshSession.refreshToken,
          domain: 'localhost',
          path: '/auth',
          maxAge: refTokenExpiresInSeconds,
          secure: false, // TODO:  temp: should be deleted
        }),
      ],
    });
  }
}

module.exports = { RefreshTokensAction };
