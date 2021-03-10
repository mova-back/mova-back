const { BaseConfig } = require('./BaseConfig');
const packageJson = require('../../package.json');

class AppConfig extends BaseConfig {
  constructor() {
    super();
    this.nodeEnv = this.set('NODE_ENV', (v) => ['development', 'production', 'test'].includes(v), 'development');
    this.port = this.set('APP_PORT', this.joi.number().port().required(), 5555);
    this.host = this.set('APP_HOST', this.joi.string().required(), 'localhost');
    this.name = this.setDirect(packageJson.name, this.joi.string().required(), 'd90375-app');
    this.url = this.set('APP_URL', this.joi.string().required());
    this.sentryDsn = this.set('SENTRY_DSN', this.joi.string().required());
    this.cookieSecret = this.set('COOKIE_SECRET', this.joi.string().min(10));
    this.mongooseConnectionURL = this.set('MDB_URL', this.joi.string());
  }

  async init() {
    // Todo ; to logger
    console.log(`${this.constructor.name}: Initialization finish...`);
  }
}

module.exports = new AppConfig();
