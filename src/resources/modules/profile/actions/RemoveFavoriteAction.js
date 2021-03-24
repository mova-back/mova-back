const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { privateItemPolicy } = require('../../../../policy');
const { ProfileSchema } = require('../../../schemas/ProfileSchema');

class RemoveFavoriteAction extends BaseAction {
  static get accessTag() {
    return 'profiles:remove-favorite';
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

    await ProfileSchema.findOneAndUpdate({ user: currentUser.id }, { $pull: { favorites: model.id } });

    return this.result({ message: `for user ${currentUser.id} favorite word by id: ${ctx.params.id} added` });
  }
}

module.exports = { RemoveFavoriteAction };
