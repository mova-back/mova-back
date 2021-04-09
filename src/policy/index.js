const actionTagPolicy = require('./actionTagPolicy');
const ownerPolicy = require('./ownerPolicy');
const privateItemPolicy = require('./privateItemPolicy');
const updateUserPolicy = require('./updateUserPolicy');
const memberPolicy = require('./memberPolicy');
const moderatorPolicy = require('./moderatorPolicy');
const adminPolicy = require('./adminPolicy');
const updateUserByModelPolicy = require('./updateUserByModelPolicy');

module.exports = {
  actionTagPolicy,
  ownerPolicy,
  privateItemPolicy,
  updateUserPolicy,
  memberPolicy,
  updateUserByModelPolicy,
  moderatorPolicy,
  adminPolicy,
};
