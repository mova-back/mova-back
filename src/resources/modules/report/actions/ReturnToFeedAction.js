const { BaseAction } = require('../../../../root');

class ReturnToFeedAction extends BaseAction {
  static get accessTag() {
    return 'reports:remove';
  }

  static get validationRules() {
    return {};
  }

  static async run() {
    return this.result({});
  }
}

module.exports = { ReturnToFeedAction };
