const { BaseAction } = require('../../../../root');
const { ProfileModel } = require('../../../models/ProfileModel');
const { WordsModel } = require('../../../models/WordsModel');

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
    const { currentUser, query } = ctx;
    const profile = await ProfileModel.getByUserId(currentUser.id);

    const data = await WordsModel.getMyWordsList(profile.favoriteWords, query);

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { FavoriteListAction };
