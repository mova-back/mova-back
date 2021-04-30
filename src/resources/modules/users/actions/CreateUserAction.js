const { BaseAction, RequestRule, AppError } = require('../../../../root');
const { emailAgent } = require('../../RootProvider');
const { UserSchema } = require('../../../schemas/UserSchema');
const { UserModel } = require('../../../models/UserModel');
const { WelcomeEmail } = require('../utils/emails/WelcomeEmail');
const { makeEmailConfirmToken } = require('../utils/makeEmailConfirmToken');
const { makePasswordHash } = require('../utils/makePasswordHash');
const { ProfileModel } = require('../../../models/ProfileModel');
const logger = require('../../../../../logger');
const { errorCodes } = require('../../../../error/errorCodes');

class CreateUserAction extends BaseAction {
  static get accessTag() {
    return 'users:create';
  }

  static get validationRules() {
    return {
      body: {
        username: new RequestRule(UserSchema.schema.obj.username, {
          required: true,
        }),
        email: new RequestRule(UserSchema.schema.obj.email, { required: true }),
        password: new RequestRule(UserSchema.schema.obj.passwordHash, {
          required: true,
        }),
      },
    };
  }

  static async run(ctx) {
    let user = {};

    const hash = await makePasswordHash(ctx.body.password);
    delete ctx.body.password;

    const checkedEmail = await UserModel.getByEmail(ctx.body.email);
    if (checkedEmail) {
      throw new AppError({ ...errorCodes.EMAIL_ALREADY_TAKEN });
    }

    const checkedUser = await UserModel.getByUsername(ctx.body.username);
    if (checkedUser) {
      throw new AppError({ ...errorCodes.USER_ALREADY_TAKEN });
    }

    try {
      user = await UserModel.create({
        ...ctx.body,
        passwordHash: hash,
      });

      await ProfileModel.create({
        userId: user.id,
      });
    } catch (err) {
      throw new AppError({ ...errorCodes.SERVER });
    }

    const emailConfirmToken = await makeEmailConfirmToken(user);
    await UserModel.findByIdAndUpdate(user.id, { emailConfirmToken });

    try {
      const result = await emailAgent.send(
        new WelcomeEmail({
          to: user.email,
          username: user.username,
          emailConfirmToken,
        })
      );
      logger.info('Registration email, delivered', { to: user.email, ...result, ctx: this.name });
    } catch (error) {
      if (error.statusCode) {
        logger.error(error.message, error, { ctx: this.name });
      } else {
        throw error;
      }
    }

    return this.result({ data: user });
  }
}

module.exports = { CreateUserAction };
