const { default: isUUID } = require('validator/lib/isuuid');
const { BaseAction, RequestRule } = require('../../../../root');
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
    const { query } = ctx;
    const data = await WordsModel.getList(query);

    return this.result({
      data: data.result,
      headers: { 'X-Total-Count': data.total },
    });
  }
}

module.exports = { ListWordsAction };
