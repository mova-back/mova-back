const { RequestRule, BaseAction } = require('../../../../root');
const { UserModel } = require('../../../models/UserModel');
const { adminPolicy } = require('../../../../policy');
const { moderator } = require('../../../../permissions/roles');

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

    adminPolicy(currentUser);

    const data = await UserModel.findByIdAndUpdate(id, { role: moderator });

    return this.result({ data });
  }
}

module.exports = { PromoteUserAction };
