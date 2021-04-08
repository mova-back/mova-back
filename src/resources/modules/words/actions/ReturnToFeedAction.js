const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { ReportSchema } = require('../../../schemas/ReportSchema');

class ReturnToFeedAction extends BaseAction {
  static get accessTag() {
    return 'reports:remove';
  }

  static get validationRules() {
    return {
      params: {
        id: new RequestRule(
          {
            validate: {
              validator: (v) => typeof v === 'string',
              message: (prop) => `${prop.value} - string`,
            },
          },
          { required: true }
        ),
      },
    };
  }

  static async run(ctx) {
    const word = await WordsModel.getById(ctx.params.id);

    // TODO : create module
    await ReportSchema.findOneAndDelete({ _id: { $in: word.complaints } });

    return this.result({ message: `Word by ${ctx.params.id} was returned` });
  }
}

module.exports = { ReturnToFeedAction };
