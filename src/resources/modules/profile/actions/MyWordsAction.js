const { BaseAction } = require('../../../../root');
const { ProfileModel } = require('../../../models/ProfileModel');
const { WordsModel } = require('../../../models/WordsModel');

class MyWordsAction extends BaseAction {
  static get accessTag() {
    return 'profiles:mywords';
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

    const data = await WordsModel.getMyWordsList(profile.createdWords, query);

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { MyWordsAction };
