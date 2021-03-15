const { AppError, BaseAction } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');
const { emailAgent } = require('../../RootProvider');
const { UserModel } = require('../../../models/UserModel');
const { makeEmailConfirmToken } = require('../utils/makeEmailConfirmToken');
const { ChangeEmail } = require('../utils/emails/ChangeEmail');

class ResendConfirmNewEmailTokenAction extends BaseAction {
  static get accessTag() {
    return 'users:resend-confirm-new-email-token';
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    const user = await UserModel.getById(currentUser.id);
    if (!user.newEmail) {
      throw new AppError({ ...errorCodes.NOT_FOUND, message: 'There is no new email confirmation.' });
    }
    const { newEmail } = user;

    const emailConfirmToken = await makeEmailConfirmToken(user);
    await emailAgent.send(new ChangeEmail({ newEmail, emailConfirmToken }));
    await UserModel.update(currentUser.id, { emailConfirmToken });

    return this.result({ message: 'Email confirmation token was send!' });
  }
}

module.exports = { ResendConfirmNewEmailTokenAction };
