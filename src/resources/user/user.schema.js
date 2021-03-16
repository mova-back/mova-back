// /* eslint-disable func-names */
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const { Schema } = mongoose;

// const userSchema = new Schema(
//   {
//     username: { type: String, required: true, unique: true, trim: true },
//     email: { type: String, required: true, unique: true, trim: true, lowercase: true },
//     bio: { type: String, required: false },
//     password: { type: String, required: true },

//     // TODO we rly need to create Data ? MongoDB create date stump auto
//     // createdAt: { type: String, default: moment().subtract(24, 'hours').toDate() },
//     // updatedAt: { type: String, default: moment().subtract(24, 'hours').toDate() },
//     createdAt: { type: Date },
//     updatedAt: { type: Date },
//     // emailVerified: { type: Boolean, default: false }
//     // это поле не нужно, для этого есть роль PRE_UR
//   },
//   { timestamps: true }
// );

// userSchema.pre('save', async function (next) {
//   const user = this;

//   if (!user.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

// userSchema.pre('findOneAndUpdate', async function () {
//   // eslint-disable-next-line no-underscore-dangle
//   this._update.password = await bcrypt.hash(this._update.password, 10);
// });

// userSchema.statics.toResponse = (user) => {
//   const { id, username, email, createdAt, updatedAt, accessToken, bio, emailVerified } = user;
//   return { id, username, email, createdAt, updatedAt, accessToken, bio, emailVerified };
// };

// const User = mongoose.model('users', userSchema);

// module.exports = User;
