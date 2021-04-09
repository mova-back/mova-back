const joi = require('joi');
const { RequestRule, BaseAction } = require('../../../../root');

const { UserModel } = require('../../../models/UserModel');

/**
 * @description return users list
 */
class ListUsersAction extends BaseAction {
  static get accessTag() {
    return 'users:list';
  }

  static get validationRules() {
    return {
      query: {
        ...this.baseQueryParams,
        orderBy: new RequestRule({
          validate: {
            validator: (v) => {
              const result = joi
                .object({
                  field: joi.string().valid('createdAt', 'username'),
                  direction: joi.string().valid('asc', 'desc'),
                })
                .validate(v);
              return (result.error && result.error.message) || true;
            },
            message: (prop) => `${prop.value} - orderBy : createAt, username`,
          },
        }),
      },
    };
  }

  static async run(req) {
    const { query } = req;
    const data = await UserModel.getList({ ...query });

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { ListUsersAction };
