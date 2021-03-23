const { BaseAction, RequestRule } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { WordSchema } = require('../../../schemas/WordSchema');

class CreateWordAction extends BaseAction {
  static get accessTag() {
    return 'posts:create';
  }

  static get validationRules() {
    return {
      body: {
        wordname: new RequestRule(WordSchema.schema.obj.wordname, { required: true }),
        meaning: new RequestRule(WordSchema.schema.obj.meaning, { required: true }),
        extended_description: new RequestRule(WordSchema.schema.obj.meaning),
        tags: new RequestRule(WordSchema.schema.obj.tags),
      },
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    const data = await WordsModel.create({ ...ctx.body, userId: currentUser.id });
    return this.result({ data });
  }
}

module.exports = { CreateWordAction };
