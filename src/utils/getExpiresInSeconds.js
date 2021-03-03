const ms = require('ms');
const moment = require('moment');

function getExpiresInSeconds(REFRESH__EXP) {
  const refTokenExpiresInMilliseconds = moment() + ms(REFRESH__EXP);
  return parseInt(refTokenExpiresInMilliseconds / 1000, 10);
}

module.exports = { getExpiresInSeconds };
