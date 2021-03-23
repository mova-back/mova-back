const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { privateItemPolicy } = require('../../../../policy');

class RemoveLikeAction extends BaseAction {
  static get accessTag() {
    return 'words:remove-like';
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

    WordsModel.update(model.id, { $pull: { likes: currentUser.id } });
    WordsModel.update(model.id, { $pull: { deslikes: currentUser.id } });

    return this.result({ message: `for User by id: ${ctx.params.id} like removed` });
  }
}

module.exports = { RemoveLikeAction };
