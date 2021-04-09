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

  // TODO check validation
  // query: {
  //   ...this.baseQueryParams,
  //   orderBy: new RequestRule({
  //     validate: {
  //       validator: (v) => {
  //         const result = joi
  //           .object({
  //             field: joi.string().valid('createdAt', 'username'),
  //             direction: joi.string().valid('asc', 'desc'),
  //           })
  //           .validate(v);
  //         return (result.error && result.error.message) || true;
  //       },
  //       message: (prop) => `${prop.value} - orderBy : createAt, username`,
  //     },
  //   }),
  // },

  static async run(ctx) {
    const { currentUser, query } = ctx;

    let data = {};

    if (query.variant === 'all') {
      data = await WordsModel.getList(query);
    } else if (currentUser.id && (query.variant === 'createdWords' || query.variant === 'favoriteWords')) {
      const profile = await ProfileModel.getByUserId(currentUser.id);
      data = await WordsModel.getListByFilter(profile[query.variant], query);
    } else if (!currentUser.id) {
      throw new AppError({ ...errorCodes.BAD_REQUEST, message: 'please provide token' });
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
