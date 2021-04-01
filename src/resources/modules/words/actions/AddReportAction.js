const { BaseAction, RequestRule, AppError } = require('../../../../root');
const { WordsModel } = require('../../../models/WordsModel');
const { privateItemPolicy } = require('../../../../policy');
const { ReportSchema } = require('../../../schemas/ReportSchema');
const { ReportModel } = require('../../../models/ReportModel');
const { errorCodes } = require('../../../../error/errorCodes');

class AddReportAction extends BaseAction {
  static get accessTag() {
    return 'words:add-report';
  }

  static get validationRules() {
    return {
      body: { message: new RequestRule(ReportSchema.schema.obj.message, { required: true }) },
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
      notEmptyBody: true,
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;
    const word = await WordsModel.getById(ctx.params.id);
    await privateItemPolicy(word, currentUser);

    const reports = await ReportSchema.find({ wordId: word.id });
    reports.forEach((report) => {
      if (currentUser.id === report.createdByUserId.toString()) {
        throw new AppError({ ...errorCodes.BAD_REQUEST, message: 'user can create only one report' });
      }
    });

    const currentReport = await ReportModel.create({
      message: ctx.body.message,
      createdByUserId: currentUser.id,
      wordId: word.id,
    });

    WordsModel.findByIdAndUpdate(word.id, { $addToSet: { complaints: currentReport.id } });

    return this.result({ message: `for User by id: ${ctx.params.id} complaint added` });
  }
}

module.exports = { AddReportAction };
