const { assert } = require('../../../../root');
const { RefreshSessionEntity } = require('./RefreshSessionEntity');
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel');

const MAX_REFRESH_SESSIONS_COUNT = 5;

async function addRefreshSession(refreshSession) {
  assert.instanceOf(refreshSession, RefreshSessionEntity);

  if (await _isValidSessionsCount(refreshSession.userId)) {
    await _addRefreshSession(refreshSession);
  } else {
    await _wipeAllUserRefreshSessions(refreshSession.userId);
    await _addRefreshSession(refreshSession);
  }
}

async function _isValidSessionsCount(userId) {
  const existingSessionsCount = await RefreshSessionModel.getCount({ userId });
  return existingSessionsCount < MAX_REFRESH_SESSIONS_COUNT;
}

async function _addRefreshSession(refreshSession) {
  await RefreshSessionModel.create(refreshSession);
}

async function _wipeAllUserRefreshSessions(userId) {
  return RefreshSessionModel.remove({ userId });
}

module.exports = { addRefreshSession };
