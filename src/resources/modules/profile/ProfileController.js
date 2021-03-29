const router = require('express').Router();

const { BaseController } = require('../../../root');

class ProfilesController extends BaseController {
  get router() {
    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { ProfilesController };
