const { BaseMiddleware } = require('../root');
const config = require('../config/AppConfig');
const logger = require('../../logger');

class InitMiddleware extends BaseMiddleware {
  async init() {
    logger.debug(`${this.constructor.name} initialized...`);
  }

  handler() {
    return (req, res, next) => {
      res.header('X-Server', config.name);
      next();
    };
  }
}

module.exports = { InitMiddleware };
