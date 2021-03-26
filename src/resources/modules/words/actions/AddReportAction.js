const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { privateItemPolicy } = require('../../../../policy');

class AddLikeAction extends BaseAction {
  static get accessTag() {
    return 'words:add-report';
  }

  static get validationRules() {
    return {
      // TODO : body, send by user
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
    await privateItemPolicy(word, currentUser);

    WordsModel.findByIdAndUpdate(word.id, { $addToSet: { likes: currentUser.id } });

    return this.result({ message: `for User by id: ${ctx.params.id} dislike added` });
  }
}

module.exports = { AddLikeAction };
