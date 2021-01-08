/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }
    // emailVerified: { type: Boolean, default: false }
    // это поле не нужно, для этого есть роль PRE_UR
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre('findOneAndUpdate', async function () {
  // eslint-disable-next-line no-underscore-dangle
  this._update.password = await bcrypt.hash(this._update.password, 10);
});

userSchema.statics.toResponse = (user) => {
  const { id, username, email, createdAt, updatedAt, emailVerified } = user;
  return { id, username, email, createdAt, updatedAt, emailVerified };
};

const User = mongoose.model('users', userSchema);

module.exports = User;
