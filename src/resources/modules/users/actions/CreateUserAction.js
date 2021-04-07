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

    try {
      user = await UserModel.create({
        ...ctx.body,
        passwordHash: hash,
      });
    } catch (err) {
      if (err.code && err.code === 11000 && Object.prototype.hasOwnProperty.call(err.keyValue, 'email')) {
        throw new AppError({ ...errorCodes.EMAIL_ALREADY_TAKEN });
      }
      if (err.code && err.code === 11000 && Object.prototype.hasOwnProperty.call(err.keyValue, 'username')) {
        throw new AppError({ ...errorCodes.USER_ALREADY_TAKEN });
      }
      throw new AppError({ ...errorCodes.SERVER });
    }

    await ProfileModel.create({
      userId: user.id,
    });

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
