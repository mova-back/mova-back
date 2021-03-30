const { BaseAction, RequestRule } = require('../../../../root');
const { updateUserByModelPolicy } = require('../../../../policy');
const { WordsModel } = require('../../../models/WordsModel');
const { ProfileSchema } = require('../../../schemas/ProfileSchema');

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

    const word = await WordsModel.getById(ctx.params.id);
    await updateUserByModelPolicy(word, currentUser);

    await WordsModel.remove(ctx.params.id);
    await ProfileSchema.findOneAndUpdate({ userId: word.createdByUserId }, { $pull: { createdWords: word.id } });
    await ProfileSchema.findOneAndUpdate({ userId: { $in: word.favoriteByUserdIds } }, { $pull: { favoriteWords: word.id } });

    return this.result({ message: `${ctx.params.id} was removed` });
  }
}

module.exports = { RemoveWordAction };
