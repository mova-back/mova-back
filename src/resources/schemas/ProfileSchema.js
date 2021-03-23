const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isJWT = require('validator/lib/isJWT');
const roles = require('../../permissions/roles');

const rolesList = Object.values(roles);

const schema = new mongoose.Schema(
  {
      favorites: {
      type: Array,
      validate: {
        validator: (v) => Array.isArray(v),
        message: (prop) => `${prop.value} - Array`,
      },
    },
  { timestamps: true }
}
);

const UserSchema = mongoose.model('user', schema);

module.exports = { UserSchema };
