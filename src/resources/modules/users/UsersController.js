const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class UsersController extends BaseController {
  get router() {
    router.get('api/users', this.actionRunner(actions.ListUsersAction));
    router.get('api/user/current', this.actionRunner(actions.GetCurrentUserAction));
    router.get('api/user/:id', this.actionRunner(actions.GetUserByIdAction));
    router.post('api/user', this.actionRunner(actions.CreateUserAction));
    router.patch('api/user', this.actionRunner(actions.UpdateUserAction));
    router.delete('api/user/:id', this.actionRunner(actions.RemoveUserAction));

    router.post('api/user/change-password', this.actionRunner(actions.ChangePasswordAction));
    router.post('api/user/send-reset-password-email', this.actionRunner(actions.SendResetPasswordEmailAction));
    router.post('api/user/reset-password', this.actionRunner(actions.ResetPasswordAction));

    router.post('api/user/confirm-registration', this.actionRunner(actions.ConfirmRegistrationAction));
    router.post('api/user/change-email', this.actionRunner(actions.ChangeEmailAction));
    router.post('api/user/confirm-email', this.actionRunner(actions.ConfirmEmailAction));
    router.post('api/user/resend-confirm-new-email-token', this.actionRunner(actions.ResendConfirmNewEmailTokenAction));
    router.post('api/user/cancel-email-changing', this.actionRunner(actions.CancelEmailChangingAction));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { UsersController };
