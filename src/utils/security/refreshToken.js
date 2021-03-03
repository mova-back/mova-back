const { v4: uuid } = require('uuid');
const refreshTokenModel = require('../../resources/refreshToken/refreshToken.model');

function makeRefreshSession({ userId, expiresIn } = {}) {
  // TODO field validation
  return {
    refreshToken: uuid(),
    userId,
    expiresIn
    // this.fingerprint = fingerprint;
    // this.ip = ip;
    // this.ua = ua || null;
  };
}

async function _isValidSessionsCount() {
  // userId
  // const existingSessionsCount = await // get session id user count >> multiple gadgets
  //  existingSessionsCount < MAX_REFRESH_SESSIONS_COUNT;
  return true;
}

async function _addRefreshSession(refreshSession) {
  await refreshTokenModel.create(refreshSession);
}

async function _wipeAllUserRefreshSessions() {
  // // validate
  // return await  // remove all refreshtoken by userId
}

async function addRefreshSession(refreshSession) {
  // validate
  if (await _isValidSessionsCount(refreshSession.userId)) {
    await _addRefreshSession(refreshSession);
  } else {
    await _wipeAllUserRefreshSessions(refreshSession.userId);
    await _addRefreshSession(refreshSession);
  }
}

// const generateAccessTokenAndRefreshToken = async (user) => {
//   // const profile = await getProfileRoleByUserId(user.id);
//   console.log(user);
//   const payload = {
//     userId: user.id
//     // role: profile.role
//   };
//
//   const accessToken = jwt.sign(payload, JWT_SECRET, {
//     expiresIn: ACCESS_EXP,
//     jwtid: jwtId, // needed for the refresh token, as a refresh token only points to one single unique token
//     subject: user.id.toString()
//   });
//
//   return { accessToken };
// };

// const generateRefreshToken = async (user, jwtId) => {
//   const refreshToken = new RefreshToken();
//
//   refreshToken.userId = user.id;
//   refreshToken.refreshToken = jwtId;
//
//   return refreshToken;
// };

// const getProfileRoleByUserId = async (id) => {
//   return profileModel.findProfileByUserId(id);
// };

module.exports = {
  makeRefreshSession,
  addRefreshSession
};
