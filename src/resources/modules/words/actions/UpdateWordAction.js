const { BaseAction, RequestRule } = require('../../../../root');

const { ownerPolicy } = require('../../../../policy');
const { WordSchema } = require('../../../schemas/WordSchema');
const { WordsModel } = require('../../../models/WordsModel');

class UpdateWordAction extends BaseAction {
  static get accessTag() {
    return 'posts:update';
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
      },
      notEmptyBody: true,
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    const model = await WordsModel.getById(ctx.params.id);
    await ownerPolicy(model, currentUser);
    const data = await WordsModel.update(ctx.params.id, ctx.body);

    return this.result({ data });
  }
}

module.exports = { UpdateWordAction };
