const { BaseMiddleware } = require('../root');

class SanitizeMiddleware extends BaseMiddleware {
  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }

  handler() {
    return (req, res, next) => {
      next();
    };
  }
}

module.exports = { SanitizeMiddleware };
