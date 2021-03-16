const ms = require('ms');
const { AppError, CookieEntity } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');

const { BaseAction } = require('../../../../root');
const { addRefreshSession } = require('../utils/addRefreshSession');
const { UserModel } = require('../../../models/UserModel');
const { RefreshSessionEntity } = require('../utils/RefreshSessionEntity');
const { makeAccessToken } = require('../utils/makeAccessToken');
const { checkPassword } = require('../../../../utils/security/checkPassword');
const config = require('../../../../config/AppConfig');

class LoginAction extends BaseAction {
  static async run(ctx) {
    let user = {};
    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.tokenRefreshExpiresIn);
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000, 10);

    try {
      user = await UserModel.getByEmail(ctx.body.email);
      console.log(user);
      await checkPassword(ctx.body.password, user.passwordHash);
    } catch (e) {
      if ([errorCodes.NOT_FOUND.code, errorCodes.INVALID_PASSWORD.code].includes(e.code)) {
        throw new AppError({ ...errorCodes.INVALID_CREDENTIALS });
      }
      throw e;
    }

    const newRefreshSession = new RefreshSessionEntity({
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint,
      expiresIn: refTokenExpiresInMilliseconds,
    });

    await addRefreshSession(newRefreshSession);
    console.log(newRefreshSession.refreshToken);
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
          secure: false, // temp: should be deleted
        }),
      ],
    });
  }
}

module.exports = { LoginAction };
