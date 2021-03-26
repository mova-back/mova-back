const { BaseAction } = require('../../../../root');

class ReportListAction extends BaseAction {
  static get accessTag() {
    return 'reports:remove';
  }

  static get validationRules() {
    return {};
  }

  static async run(ctx) {
    return this.result({});
  }
}

module.exports = { ReportListAction };
