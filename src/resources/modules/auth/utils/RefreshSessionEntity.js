class RefreshSessionEntity {
  constructor({ userId, fingerprint, ip, ua, expiresIn } = {}) {
    this.userId = userId;
    this.fingerprint = fingerprint;
    this.ip = ip;
    this.expiresIn = expiresIn;
    this.ua = ua || null;
  }
}

module.exports = { RefreshSessionEntity };
