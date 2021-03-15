const { RequestRule, BaseAction } = require('../../../../root');

const { UserModel } = require('../../../models/UserModel');
const { UserSchema } = require('../../../schemas/UserSchema');

/**
 * @description return user by id
 */
class GetUserByIdAction extends BaseAction {
  static get accessTag() {
    return 'users:get-by-id';
  }

  static get validationRules() {
    return {
      params: {
        id: new RequestRule(UserSchema.schema.obj.id, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const model = await UserModel.getById(ctx.params.id);

    return this.result({ data: model });
  }
}

module.exports = { GetUserByIdAction };
