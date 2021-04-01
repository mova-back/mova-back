const ms = require('ms');
const { CookieEntity, AppError, BaseAction, RequestRule } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');

const { addRefreshSession } = require('../utils/addRefreshSession');
const { verifyRefreshSession } = require('../utils/verifyRefreshSession');
const { makeAccessToken } = require('../utils/makeAccessToken');
const { RefreshSessionEntity } = require('../utils/RefreshSessionEntity');
const { UserModel } = require('../../../models/UserModel');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');
const { AuthValidationSchema } = require('../../../schemas/AuthValidationSchema');
const config = require('../../../../config/AppConfig');

class RefreshTokensAction extends BaseAction {
  static get accessTag() {
    return 'auth:refresh-tokens';
  }

  static get validationRules() {
    return {
      body: {
        // fingerprint: new RequestRule(AuthValidationSchema.schema.fingerprint, { required: true }), // https://github.com/Valve/fingerprintjs2
        refreshToken: new RequestRule(AuthValidationSchema.schema.refreshToken),
      },
      cookies: {
        refreshToken: new RequestRule(AuthValidationSchema.schema.refreshToken),
      },
    };
  }

  static async run(ctx) {
    // take refresh token from any possible source
    // TODO : Fix save cookies refresh token(old)
    console.log('AAAAAAAAA', ctx.cookies.refreshToken);
    const reqRefreshToken = ctx.cookies.refreshToken;
    // console.log('BAG!!!reqRefreshToken', reqRefreshToken);
    // console.log('BAG!!!ctx.cookies.refreshToken', ctx.cookies.refreshToken);
    // console.log('BAG!!!ctx.body.refreshToken', ctx.body.refreshToken);
    const reqFingerprint = ctx.body.fingerprint;
    console.log('@@@@@@@@', reqRefreshToken);

    if (!reqRefreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' });
    }

    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.tokenRefreshExpiresIn);
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000, 10);
    const oldRefreshSession = await RefreshSessionModel.getByRefreshToken(reqRefreshToken);
    await RefreshSessionModel.removeToken(reqRefreshToken);
    await verifyRefreshSession(new RefreshSessionEntity(oldRefreshSession), reqFingerprint);
    const user = await UserModel.getById(oldRefreshSession.userId);

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
          // domain: 'localhost',
          // path: '/auth',
          maxAge: refTokenExpiresInSeconds,
          secure: false, // TODO:  temp: should be deleted
        }),
      ],
    });
  }
}

module.exports = { RefreshTokensAction };
