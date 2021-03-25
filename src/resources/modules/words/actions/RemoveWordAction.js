const { BaseAction, RequestRule, AppError } = require('../../../../root');
const { ownerPolicy } = require('../../../../policy');
const { WordsModel } = require('../../../models/WordsModel');
const { errorCodes } = require('../../../../error/errorCodes');

const roles = require('../../../../permissions/roles');
const { ProfileSchema } = require('../../../schemas/ProfileSchema');
const { WordSchema } = require('../../../schemas/WordSchema');

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
    await ownerPolicy(word, currentUser);

    if (currentUser.role === roles.user && currentUser.id !== word.createdByUserId.toString()) {
      throw new AppError({ ...errorCodes.FORBIDDEN, message: "Access denied, don't have permissions." });
    }

    // TODO PROFILE MODULE
    await WordsModel.remove(ctx.params.id);
    await ProfileSchema.findOneAndUpdate({ userId: word.createdByUserId }, { $pull: { createdWords: word.id } });
    await ProfileSchema.findOneAndUpdate({ userId: { $in: word.favoriteByUserdIds } }, { $pull: { favoriteWords: word.id } });
    return this.result({ message: `${ctx.params.id} was removed` });
  }
}

module.exports = { RemoveWordAction };
