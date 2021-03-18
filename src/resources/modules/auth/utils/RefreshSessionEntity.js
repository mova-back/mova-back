const { v4: uuidv4 } = require('uuid');
const { assert } = require('../../../../root');
const { UserSchema } = require('../../../schemas/UserSchema');
const { RefreshSessionSchema } = require('../../../schemas/RefreshSessionSchema');

class RefreshSessionEntity {
  constructor({ userId, fingerprint, ip, ua, expiresIn } = {}) {
    assert.mongoAutoId(userId, { required: true });
    // assert.validate(fingerprint, RefreshSessionSchema.schema.obj.fingerprint, { required: true });
    assert.validate(ip, RefreshSessionSchema.schema.obj.ip, { required: true });
    assert.validate(expiresIn, RefreshSessionSchema.schema.obj.expiresIn, { required: true });
    assert.validate(ua, RefreshSessionSchema.schema.obj.ua);

    this.refreshToken = uuidv4();
    this.userId = userId;
    this.fingerprint = fingerprint;
    this.ip = ip;
    this.expiresIn = expiresIn;
    this.ua = ua || null;
  }
}

module.exports = { RefreshSessionEntity };
