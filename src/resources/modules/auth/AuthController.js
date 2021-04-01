const router = require('express').Router();

const { BaseController } = require('../../../root');
const actions = require('./actions');

class AuthController extends BaseController {
  get router() {
    router.post('/api/auth/login', this.actionRunner(actions.LoginAction));
    router.post('/api/auth/logout', this.actionRunner(actions.LogoutAction));
    router.post('/api/auth/refresh-token', this.actionRunner(actions.RefreshTokensAction));

    return router;
  }

  async init() {
    this.logger.debug(`${this.constructor.name} initialized...`);
  }
}

module.exports = { AuthController };
