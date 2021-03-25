const { BaseAction, RequestRule } = require('../../../../root');
const { emailAgent } = require('../../RootProvider');
const { UserSchema } = require('../../../schemas/UserSchema');
const { UserModel } = require('../../../models/UserModel');
const { WelcomeEmail } = require('../utils/emails/WelcomeEmail');
const { makeEmailConfirmToken } = require('../utils/makeEmailConfirmToken');
const { makePasswordHash } = require('../utils/makePasswordHash');
const { ProfileModel } = require('../../../models/ProfileModel');

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
    const hash = await makePasswordHash(ctx.body.password);
    delete ctx.body.password;

    const user = await UserModel.create({
      ...ctx.body,
      passwordHash: hash,
    });

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
      // TODO : log info
      console.log('Registration email, delivered', { to: user.email, ...result, ctx: this.name });
    } catch (error) {
      if (error.statusCode) {
        // log mailGun errors
        // TODO : log error
        console.log(error.message, error, { ctx: this.name });
      } else {
        throw error;
      }
    }

    return this.result({ data: user });
  }
}

module.exports = { CreateUserAction };
