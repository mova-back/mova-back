const { assert } = require('../../../../../root');

const { UserSchema } = require('../../../../schemas/UserSchema');
const { config } = require('../../../../../config/AppConfig');

class ChangeEmail {
  constructor({ newEmail, emailConfirmToken } = {}) {
    // eslint-disable-next-line prefer-rest-params
    assert.object(arguments[0], { required: true });
    assert.validate(newEmail, UserSchema.schema.obj.email, { required: true });
    assert.validate(emailConfirmToken, UserSchema.schema.obj.emailConfirmToken, { required: true });

    this.to = newEmail;
    this.subject = `[${config.name}] Confirm new email`;
    this.text = `To confirm email: ${newEmail} please follow this link >> ${config.url}/a/confirm-email?emailConfirmToken=${emailConfirmToken}

If you don’t use this link within ${config.tokenEmailConfirmExpiresIn}, it will expire.

Thanks,
The ${config.name} Team`;
  }
}

module.exports = { ChangeEmail };
