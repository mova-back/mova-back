const { Logger } = require('./src/root/abstract/Logger');

const sentryDsn = process.env.SENTRY_DSN;
const isDev = process.env.NODE_ENV === 'development';

module.exports = new Logger({
  appName: 'mova',
  raw: !isDev,
  ...(!isDev && { capture: true, sentryDsn }),
});
