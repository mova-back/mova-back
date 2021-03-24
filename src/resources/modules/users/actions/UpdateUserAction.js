const { RequestRule, BaseAction } = require('../../../../root');
const { UserSchema } = require('../../../schemas/UserSchema');
const { UserModel } = require('../../../models/UserModel');

class UpdateUserAction extends BaseAction {
  static get accessTag() {
    return 'users:update';
  }

  static get validationRules() {
    return {
      body: {
        username: new RequestRule(UserSchema.schema.obj.name),
      },
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;
    const data = await UserModel.update(currentUser.id, ctx.body); // user can update only itself

    return this.result({ data });
  }
}

module.exports = { UpdateUserAction };
