const { assert } = require('../../../../../root');

const { UserSchema } = require('../../../../schemas/UserSchema');
const config = require('../../../../../config/AppConfig');

class WelcomeEmail {
  constructor({ to, username, emailConfirmToken } = {}) {
    // eslint-disable-next-line prefer-rest-params
    assert.object(arguments[0], { required: true });
    assert.validate(to, UserSchema.schema.obj.email, { required: true });
    assert.validate(username, UserSchema.schema.obj.username, { required: true });
    assert.validate(emailConfirmToken, UserSchema.schema.obj.emailConfirmToken, { required: true });

    this.to = to;
    this.subject = `[${config.name}] Welcome on board! Confirmation instructions.`;
    this.text = `Welcome to ${config.name}!
${username} we just created new account for you. Your login: ${to}

To finish registration process click the link below to confirm your account.
${config.url}/a/confirm-registration?emailConfirmToken=${emailConfirmToken}

Looking forward to working with you!

Cheers,
The ${config.name} Team`;
  }
}

module.exports = { WelcomeEmail };
