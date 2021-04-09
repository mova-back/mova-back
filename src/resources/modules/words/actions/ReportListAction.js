const { moderatorPolicy } = require('../../../../policy');
const { BaseAction } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');

class ReportListAction extends BaseAction {
  static get accessTag() {
    return 'reports:list';
  }

  static get validationRules() {
    return {
      query: {
        ...this.baseQueryParams,
      },
    };
  }

  static async run(ctx) {
    const { currentUser, query } = ctx;

    moderatorPolicy(currentUser);

    const { result, total } = await WordsModel.getReportList(query);
    return this.result({ data: result, headers: { 'X-Total-Count': total } });
  }
}

module.exports = { ReportListAction };
