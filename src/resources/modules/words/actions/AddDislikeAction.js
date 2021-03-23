const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { privateItemPolicy } = require('../../../../policy');

class AddDislikeAction extends BaseAction {
  static get accessTag() {
    return 'words:add-dislike';
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

    const data = WordsModel.update(model.id, { dislikes: currentUser.id });
    const ar = WordsModel.update(model.id, { $pull: { likes: currentUser.id } });

    return this.result({ data });
  }
}

module.exports = { AddDislikeAction };