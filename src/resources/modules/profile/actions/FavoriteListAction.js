const { BaseAction } = require('../../../../root');
const { ProfileModel } = require('../../../models/ProfileModel');

class FavoriteListAction extends BaseAction {
  static get accessTag() {
    return 'profiles:list';
  }

  static get validationRules() {
    return {
      query: {
        ...this.baseQueryParams,
      },
    };
  }

  static async run(ctx) {
    const { query } = ctx;
    const data = await ProfileModel.getList(query);

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { FavoriteListAction };
