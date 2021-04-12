const { RequestRule, BaseAction, AppError } = require('../../../../root');
const { UserModel } = require('../../../models/UserModel');
const { adminPolicy } = require('../../../../policy');
const { moderator, user } = require('../../../../permissions/roles');
const { errorCodes } = require('../../../../error/errorCodes');

class UnpromoteUserAction extends BaseAction {
  static get accessTag() {
    return 'users:unpromote';
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

    adminPolicy(currentUser);

    const targetUser = await UserModel.getById(id);
    if (targetUser.role !== moderator) {
      throw new AppError({ ...errorCodes.NOT_FOUND, message: 'user already is have role user/anonymous' });
    }

    const data = await UserModel.findByIdAndUpdate(id, { role: user });
    return this.result({ data });
  }
}

module.exports = { UnpromoteUserAction };
