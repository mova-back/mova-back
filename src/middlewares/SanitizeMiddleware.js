const logger = require('../../logger');
const { BaseMiddleware } = require('../root');

class SanitizeMiddleware extends BaseMiddleware {
  async init() {
    logger.debug(`${this.constructor.name} initialized...`);
  }

  handler() {
    return (req, res, next) => {
      next();
    };
  }
}

module.exports = { SanitizeMiddleware };
