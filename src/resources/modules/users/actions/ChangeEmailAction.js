const { AppError, RequestRule, BaseAction } = require('../../../../root');

const { errorCodes } = require('../../../../error/errorCodes');

const { ChangeEmail } = require('../utils/emails/ChangeEmail');
const { makeEmailConfirmToken } = require('../utils/makeEmailConfirmToken');
const { emailAgent } = require('../../RootProvider');
const { UserModel } = require('../../../models/UserModel');
const { UserSchema } = require('../../../schemas/UserSchema');

class ChangeEmailAction extends BaseAction {
  static get accessTag() {
    return 'users:change-email';
  }

  static get validationRules() {
    return {
      body: {
        newEmail: new RequestRule(UserSchema.schema.obj.newEmail, { required: true }),
      },
    };
  }

  static async run(ctx) {
    const { currentUser } = ctx;
    const { newEmail } = ctx.body;

    const isExist = await UserModel.isEmailExist(newEmail);
    if (isExist) throw new AppError({ ...errorCodes.EMAIL_ALREADY_TAKEN });

    const emailConfirmToken = await makeEmailConfirmToken({ ...currentUser, newEmail });
    await emailAgent.send(new ChangeEmail({ newEmail, emailConfirmToken }));
    await UserModel.findByIdAndUpdate(currentUser.id, { newEmail, emailConfirmToken });

    return this.result({ message: `User requested change email to ${newEmail}!` });
  }
}

module.exports = { ChangeEmailAction };
