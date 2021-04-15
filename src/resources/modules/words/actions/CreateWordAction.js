const { BaseAction, RequestRule } = require('../../../../root');
const { ProfileModel } = require('../../../models/ProfileModel');
const { WordsModel } = require('../../../models/WordsModel');
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
        extended_description: new RequestRule(WordSchema.schema.obj.extended_description),
        tags: new RequestRule(WordSchema.schema.obj.tags),
        usages: new RequestRule(WordSchema.schema.obj.usages),
        swearing: new RequestRule(WordSchema.schema.obj.swearing),
      },
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    const word = await WordsModel.create({ ...ctx.body, createdByUserId: currentUser.id });

    await ProfileModel.updateEntetyByField({ userId: currentUser.id }, { $addToSet: { createdWords: word.id } });
    return this.result({ data: word });
  }
}

module.exports = { CreateWordAction };
