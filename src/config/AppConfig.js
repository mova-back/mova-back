const { BaseConfig } = require('./BaseConfig');
const packageJson = require('../../package.json');

const expiresInRegexp = /^(\d\d?m$|\d\d?h$|\d\d?d$)/;

class AppConfig extends BaseConfig {
  constructor() {
    super();
    this.nodeEnv = this.set('NODE_ENV', (v) => ['development', 'production', 'test'].includes(v), 'development');
    this.port = this.set('PORT', this.joi.number().port().required());
    this.host = this.set('APP_HOST', this.joi.string().required(), 'localhost');
    this.name = this.setDirect(packageJson.name, this.joi.string().required(), 'd90375-app');
    this.url = this.set('APP_URL', this.joi.string().required());
    this.sentryDsn = this.set('SENTRY_DSN', this.joi.string().required());
    this.cookieSecret = this.set('COOKIE_SECRET', this.joi.string().min(10));
    this.mongooseConnectionURL = this.set('MDB_URL', this.joi.string());
    this.tokenAccesExpiresIn = this.set('TOKEN_ACCESS_EXP', this.joi.string().regex(expiresInRegexp).required());
    this.tokenAccesSecret = this.set('TOKEN_ACCESS_SECRET', this.joi.string().min(30).max(100).required());
    this.tokenRefreshExpiresIn = this.set('TOKEN_REFRESH_EXP', this.joi.string().regex(expiresInRegexp).required());
    this.mailgunApiKey = this.set('MAILGUN_API_KEY', (v) => v.includes(''));
    this.mailgunDomain = this.set('MAILGUN_DOMAIN', this.joi.string().min(5).max(100).required());
    this.mailgunHost = this.set('MAILGUN_HOST', this.joi.string().min(5).max(100).required(), 'api.mailgun.net'); // or 'api.eu.mailgun.net'
    this.from = this.set('EMAIL_FROM', this.joi.string().min(10).max(100).required());
    this.jwtISS = this.set('JWT_ISS', this.joi.string().required());
    this.tokenResetPasswordSecret = this.set('TOKEN_RESET_PASSWORD_SECRET', this.joi.string().min(30).max(100).required());
    this.tokenResetPasswordExpiresIn = this.set('TOKEN_RESET_PASSWORD_EXP', this.joi.string().regex(expiresInRegexp));
    this.tokenEmailConfirmSecret = this.set('TOKEN_EMAIL_CONFIRM_SECRET', this.joi.string().min(30).max(100).required());
    this.tokenEmailConfirmExpiresIn = this.set('TOKEN_EMAIL_CONFIRM_EXP', this.joi.string().regex(expiresInRegexp));
  }

  async init() {
    // Todo ; to logger
    console.log(`${this.constructor.name}: Initialization finish...`);
  }
}

module.exports = new AppConfig();
