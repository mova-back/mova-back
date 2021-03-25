const { BaseAction, RequestRule } = require('../../../../root');
const { ownerPolicy } = require('../../../../policy');
const { WordsModel } = require('../../../models/WordsModel');

class RemoveWordAction extends BaseAction {
  static get accessTag() {
    return 'words:delete';
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
    await ownerPolicy(model, currentUser);

    await WordsModel.remove(ctx.params.id);

    return this.result({ message: `${ctx.params.id} was removed` });
  }
}

module.exports = { RemoveWordAction };
