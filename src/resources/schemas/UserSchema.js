const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isJWT = require('validator/lib/isJWT');
const roles = require('../../permissions/roles');

const rolesList = Object.values(roles);

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Enter a username.'],
      unique: [true, 'That username is taken.'],
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 3 && v.length <= 25,
        message: (prop) => `${prop.value} - string; min 3; max 25 chars`,
      },
    },
    role: {
      type: String,
      default: roles.anonymous,
      validate: {
        validator: (v) => typeof v === 'string' && rolesList.includes(v),
        message: (prop) => `${prop.value} is not a vaild role`,
      },
    },
    email: {
      type: String,
      require: [true, 'Enter an email address.'],
      unique: [true, 'That email address is taken.'],
      lowercase: true,
      validate: {
        validator: (v) => isEmail(v) && v.length <= 50,
        message: (prop) => `${prop.value}-  string; email; max 50 chars`,
      },
    },
    newEmail: {
      type: String,
      // unique: true,
      validate: {
        validator: (v) => isEmail(v) && v.length <= 50,
        message: (prop) => `${prop.value}-  string; email; max 50 chars`,
      },
    },
    isConfirmedRegistration: {
      type: Boolean,
      default: false,
    },
    emailConfirmToken: {
      type: String,
      validate: { validator: (v) => isJWT(v), message: (prop) => `${prop.value} - string; jwt;` },
    },
    resetPasswordToken: {
      type: String,
      validate: { validator: (v) => isJWT(v), message: (prop) => `${prop.value} - string; min 8 chars;` },
    },
    passwordHash: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 8,
        message: (prop) => `${prop.value} - string; min 8 chars;`,
      },
    },
    location: {
      type: Number,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 8 && v.length <= 300,
        message: (prop) => `${prop.value} - string; min 3; max 300 chars;`,
      },
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'profile' },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model('user', schema);

module.exports = { UserSchema };
