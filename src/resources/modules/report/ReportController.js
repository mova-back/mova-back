const express = require('express');

const router = express.Router();
// const actions = require('./actions');

const { BaseController } = require('../../../root');
const RootProvider = require('../RootProvider');

class ReportController extends BaseController {
  get router() {
    // router.delete('/api/reports/delete/:id', this.actionRunner(actions.ReportListAction));
    // router.post('/api/update/:id', this.actionRunner(actions.ReportListAction));

    return router;
  }

  async init() {
    this.logger.debug(`${this.constructor.name} initialized...`);
    await RootProvider.init();
  }
}

module.exports = { ReportController };
