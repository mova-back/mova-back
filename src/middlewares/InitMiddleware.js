const { BaseMiddleware } = require('supra-core');
const config = require('../config');

class InitMiddleware extends BaseMiddleware {
  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }

  handler() {
    return (req, res, next) => {
      res.header('X-Server', config.app.name);
      next();
    };
  }
}

module.exports = { InitMiddleware };
