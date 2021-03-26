const express = require('express');

const router = express.Router();
const actions = require('./actions');

const { BaseController } = require('../../../root');
const RootProvider = require('../RootProvider');

class ReportController extends BaseController {
  get router() {
    router.get('/api/reports', this.actionRunner(actions.ReportListAction));
    router.put('/api/return/:id', this.actionRunner(actions.ReportListAction));
    router.delete('/api/delete/:id', this.actionRunner(actions.ReportListAction));
    router.post('/api/update/:id', this.actionRunner(actions.ReportListAction));

    return router;
  }

  async init() {
    //TODO console.debug
    console.log(`${this.constructor.name} initialized...`);
    await RootProvider.init();
  }
}

module.exports = { ReportController };
