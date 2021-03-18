const { BaseMiddleware } = require('../root');
const config = require('../config/AppConfig');

class InitMiddleware extends BaseMiddleware {
  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }

  handler() {
    return (req, res, next) => {
      res.header('X-Server', config.name);
      next();
    };
  }
}

module.exports = { InitMiddleware };
