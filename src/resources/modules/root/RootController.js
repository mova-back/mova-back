const express = require('express');

const router = express.Router();

const { BaseController } = require('../../../root');
const RootProvider = require('../RootProvider');

class RootController extends BaseController {
  get router() {
    router.get('/', (req, res) => {
      res.json({ success: true, message: 'Service ok!' });
    });

    return router;
  }

  async init() {
    this.logger.debug(`${this.constructor.name} initialized...`);
    await RootProvider.init();
  }
}

module.exports = { RootController };
