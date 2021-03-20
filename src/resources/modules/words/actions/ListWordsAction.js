const { BaseAction } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');

class ListWordsAction extends BaseAction {
  static get accessTag() {
    return 'posts:list';
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
    const data = await WordsModel.getWordsList(query);
    console.log('data', data);

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { ListWordsAction };
