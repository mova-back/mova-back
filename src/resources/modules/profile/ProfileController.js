const router = require('express').Router();

const { BaseController } = require('../../../root');

class ProfilesController extends BaseController {
  get router() {
    return router;
  }

  async init() {
    this.logger.debug(`${this.constructor.name} initialized...`);
  }
}

module.exports = { ProfilesController };
