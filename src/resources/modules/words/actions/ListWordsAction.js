const { errorCodes } = require('../../../../error/errorCodes');
const { BaseAction, AppError } = require('../../../../root');
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

    let data = {};

    if (query.variant === 'all') {
      data = await WordsModel.getList(query);
    }

    if (currentUser.id && (query.variant === 'createdWords' || query.variant === 'favoriteWords')) {
      const profile = await ProfileModel.getByUserId(currentUser.id);
      data = await WordsModel.getListByFilter(profile[query.variant], query);
    } else {
      throw new AppError({ ...errorCodes.BAD_REQUEST, message: 'incorrect variant query' });
    }

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { ListWordsAction };
