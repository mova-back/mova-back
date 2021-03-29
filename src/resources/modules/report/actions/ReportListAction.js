const { adminPolicy } = require('../../../../policy');
const { BaseAction } = require('../../../../root');
const { WordSchema } = require('../../../schemas/WordSchema');

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
    console.log(query);

    adminPolicy({}, currentUser);

    // TODO : filter by count reports

    // data = await WordsModel.getListByFilter(query);
    // TODO :create model
    const data = await WordSchema.find({ complaints: { $exists: true, $ne: [] } }).populate('complaints');
    return this.result({ data });
  }
}

module.exports = { ReportListAction };
