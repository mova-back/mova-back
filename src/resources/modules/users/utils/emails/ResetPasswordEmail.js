const { assert } = require('../../../../../root');

const { UserSchema } = require('../../../../schemas/UserSchema');
const config = require('../../../../../config/AppConfig');

class ResetPasswordEmail {
  constructor({ to, resetPasswordToken } = {}) {
    assert.object(arguments[0], { required: true });
    assert.validate(to, UserSchema.schema.obj.email, { required: true });
    assert.validate(resetPasswordToken, UserSchema.schema.obj.resetPasswordToken, { required: true });

    this.to = to;
    this.subject = `[${config.name}] Password reset instructions`;
    this.text = `Hi there! We received a request to reset your ${config.name} account password.

To to reset password please follow this link >> ${config.url}/a/reset-password?resetPasswordToken=${resetPasswordToken}

If you did not request a password reset, feel free to disregard this email - your password will not be changed.
If you don’t use this link within ${config.tokenResetPasswordExpiresIn}, it will expire.

Thanks,
The ${config.name} Team`;
  }
}

module.exports = { ResetPasswordEmail };
