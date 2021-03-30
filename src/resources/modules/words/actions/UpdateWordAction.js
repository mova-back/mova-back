const { BaseAction, RequestRule } = require('../../../../root');
const { WordSchema } = require('../../../schemas/WordSchema');
const { WordsModel } = require('../../../models/WordsModel');
const updateUserByModelPolicy = require('../../../../policy/updateUserByModelPolicy');

class UpdateWordAction extends BaseAction {
  static get accessTag() {
    return 'words:update';
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
      body: {
        wordname: new RequestRule(WordSchema.schema.obj.wordname),
        meaning: new RequestRule(WordSchema.schema.obj.meaning),
        extended_description: new RequestRule(WordSchema.schema.obj.meaning),
        tags: new RequestRule(WordSchema.schema.obj.tags),
        usages: new RequestRule(WordSchema.schema.obj.usages),
        swearing: new RequestRule(WordSchema.schema.obj.swearing),
      },
      notEmptyBody: true,
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    const word = await WordsModel.getById(ctx.params.id);
    await updateUserByModelPolicy(word, currentUser);

    const data = await WordsModel.findByIdAndUpdate(ctx.params.id, ctx.body);

    return this.result({ data });
  }
}

module.exports = { UpdateWordAction };
