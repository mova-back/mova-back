const { BaseAction } = require('../../../../root');
const { ProfileModel } = require('../../../models/ProfileModel');
const { WordsModel } = require('../../../models/WordsModel');

class ListWordsAction extends BaseAction {
  static get accessTag() {
    return 'words:list';
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
    let data = {};

    if (query.variant === 'all') {
      data = await WordsModel.getList(query);
    }

    data = await WordsModel.getMyWordsList(profile[query.variant], query);

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { ListWordsAction };
