const { BaseAction, RequestRule } = require('../../../../root');
const { ProfileModel } = require('../../../models/ProfileModel');
const { WordsModel } = require('../../../models/WordsModel');
const { ProfileSchema } = require('../../../schemas/ProfileSchema');
const { WordSchema } = require('../../../schemas/WordSchema');

class CreateWordAction extends BaseAction {
  static get accessTag() {
    return 'words:create';
  }

  static get validationRules() {
    return {
      body: {
        wordname: new RequestRule(WordSchema.schema.obj.wordname, { required: true }),
        meaning: new RequestRule(WordSchema.schema.obj.meaning, { required: true }),
        extended_description: new RequestRule(WordSchema.schema.obj.meaning),
        tags: new RequestRule(WordSchema.schema.obj.tags),
        usages: new RequestRule(WordSchema.schema.obj.usages),
        swearing: new RequestRule(WordSchema.schema.obj.swearing),
      },
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    const word = await WordsModel.create({ ...ctx.body, userId: currentUser.id });
    await ProfileModel.updateEntetyByField({ user: currentUser.id }, { $push: { createdWords: word.id } });

    return this.result({ data: word });
  }
}

module.exports = { CreateWordAction };
