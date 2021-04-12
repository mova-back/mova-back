const { RequestRule, BaseAction } = require('../../../../root');
const { UserModel } = require('../../../models/UserModel');
const { ProfileModel } = require('../../../models/ProfileModel');

const { updateUserPolicy } = require('../../../../policy/updateUserPolicy');
const { WordsModel } = require('../../../models/WordsModel');

class RemoveUserAction extends BaseAction {
  static get accessTag() {
    return 'users:remove';
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

  static async run(req) {
    const { currentUser } = req;
    const { id } = req.params;

    const model = await UserModel.getById(id);
    await updateUserPolicy(model, currentUser);
    await WordsModel.findAndDeleteFields({ $pull: { createdByUserId: id, favoriteByUserdIds: id, likes: id, dislikes: id } });
    await ProfileModel.findByIdAndDelete({ userId: id });
    await UserModel.findByIdAndDelete(id);

    return this.result({ message: `${id} was removed` });
  }
}

module.exports = { RemoveUserAction };
