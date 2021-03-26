const actionTagPolicy = require('./actionTagPolicy');
const ownerPolicy = require('./ownerPolicy');
const privateItemPolicy = require('./privateItemPolicy');
const updateUserPolicy = require('./updateUserPolicy');
const memberPolicy = require('./memberPolicy');
const adminPolicy = require('./adminsPolicy');
const updateUserByModelPolicy = require('./updateUserByModelPolicy');

module.exports = {
  actionTagPolicy,
  ownerPolicy,
  privateItemPolicy,
  updateUserPolicy,
  memberPolicy,
  updateUserByModelPolicy,
  adminPolicy,
};
