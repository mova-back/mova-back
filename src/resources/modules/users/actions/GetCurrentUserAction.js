const { BaseAction } = require('../../../../root');

const { UserModel } = require('../../../models/UserModel');
const { ProfileSchema } = require('../../../schemas/ProfileSchema');
const { UserSchema } = require('../../../schemas/UserSchema');

class GetCurrentUserAction extends BaseAction {
  static get accessTag() {
    return 'users:get-current-user';
  }

  static async run(ctx) {
    const { currentUser } = ctx;

    // TODO : create models
    const profile = await ProfileSchema.findOne({ user: currentUser.id });
    await UserSchema.findByIdAndUpdate(currentUser.id, { $addToSet: { profile: profile.id } });
    const data = await UserSchema.findById(currentUser.id).populate('profile').exec();

    delete data.passwordHash;

    return this.result({ data });
  }
}

module.exports = { GetCurrentUserAction };
