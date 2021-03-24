const { RequestRule, BaseAction } = require('../../../../root');

const { UserModel } = require('../../../models/UserModel');

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
    const model = await UserModel.getById(ctx.params.id);

    return this.result({ data: model });
  }
}

module.exports = { GetUserByIdAction };
