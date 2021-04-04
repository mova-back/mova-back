const { AppError, assert } = require('../../../../root');
const { errorCodes } = require('../../../../error/errorCodes');
const { RefreshSessionEntity } = require('./RefreshSessionEntity');

function verifyRefreshSession(oldRefreshSession, newFingerprint, ip) {
  assert.instanceOf(oldRefreshSession, RefreshSessionEntity);
  assert.string(newFingerprint, { notEmpty: true });
  assert.string(ip, { notEmpty: true });

  return new Promise((resolve, reject) => {
    const nowTime = new Date().getTime();

    if (nowTime > oldRefreshSession.expiresIn) return reject(new AppError({ ...errorCodes.SESSION_EXPIRED }));
    if (oldRefreshSession.ip !== ip) return reject(new AppError({ ...errorCodes.INVALID_REFRESH_SESSION }));
    if (oldRefreshSession.fingerprint !== newFingerprint) return reject(new AppError({ ...errorCodes.INVALID_REFRESH_SESSION }));
    return resolve();
  });
}

module.exports = { verifyRefreshSession };
