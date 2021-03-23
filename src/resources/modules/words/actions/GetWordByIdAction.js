const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { WordSchema } = require('../../../schemas/WordSchema');
const { privateItemPolicy } = require('../../../../policy');

class GetWordByIdAction extends BaseAction {
  static get accessTag() {
    return 'posts:get-by-id';
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
    const { currentUser } = ctx;

    const model = await WordsModel.getById(ctx.params.id);
    await privateItemPolicy(model, currentUser);

    return this.result({ data: model });
  }
}

module.exports = { GetWordByIdAction };
