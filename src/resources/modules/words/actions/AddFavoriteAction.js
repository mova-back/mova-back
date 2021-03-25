const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { privateItemPolicy } = require('../../../../policy');
const { ProfileModel } = require('../../../models/ProfileModel');

class AddFavoriteAction extends BaseAction {
  static get accessTag() {
    return 'profiles:add-favorite';
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
    const currentWord = await WordsModel.getById(ctx.params.id);
    await privateItemPolicy(currentWord, currentUser);

    const word = await WordsModel.findByIdAndUpdate(ctx.params.id, { $addToSet: { favoriteByUserdIds: currentUser.id } });
    await ProfileModel.updateEntetyByField({ userId: currentUser.id }, { $addToSet: { favoriteWords: word.id } });

    return this.result({ message: `for user ${currentUser.id} favorite word by id: ${ctx.params.id} added` });
  }
}

module.exports = { AddFavoriteAction };
