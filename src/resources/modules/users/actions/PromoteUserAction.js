const { RequestRule, BaseAction, AppError } = require('../../../../root');
const { UserModel } = require('../../../models/UserModel');
const { adminPolicy } = require('../../../../policy');
const { moderator, admin } = require('../../../../permissions/roles');
const { errorCodes } = require('../../../../error/errorCodes');

class PromoteUserAction extends BaseAction {
  static get accessTag() {
    return 'users:promote';
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
    const { currentUser, params } = ctx;
    const { id } = params;
    let data = {};

    adminPolicy(currentUser);

    const userToPromote = await UserModel.getById(id);
    if (userToPromote.role === admin) {
      throw new AppError({ ...errorCodes.BAD_ROLE });
    }

    data = await UserModel.findByIdAndUpdate(id, { role: moderator });
    return this.result({ data });
  }
}

module.exports = { PromoteUserAction };
