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

  // TODO check validation
  // query: {
  //   ...this.baseQueryParams,
  //   orderBy: new RequestRule({
  //     validate: {
  //       validator: (v) => {
  //         const result = joi
  //           .object({
  //             field: joi.string().valid('createdAt', 'username'),
  //             direction: joi.string().valid('asc', 'desc'),
  //           })
  //           .validate(v);
  //         return (result.error && result.error.message) || true;
  //       },
  //       message: (prop) => `${prop.value} - orderBy : createAt, username`,
  //     },
  //   }),
  // },

  static async run(ctx) {
    const { currentUser, query } = ctx;

    moderatorPolicy({}, currentUser);

    const { result, total } = await WordsModel.getReportList(query);
    return this.result({ data: result, headers: { 'X-Total-Count': total } });
  }
}

module.exports = { ReportListAction };
