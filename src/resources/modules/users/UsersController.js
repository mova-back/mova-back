const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class UsersController extends BaseController {
  get router() {
    router.get('/users', this.actionRunner(actions.ListUsersAction));
    router.get('/user/current', this.actionRunner(actions.GetCurrentUserAction));
    router.get('/user/:id', this.actionRunner(actions.GetUserByIdAction));
    router.post('/user', this.actionRunner(actions.CreateUserAction));
    router.patch('/user', this.actionRunner(actions.UpdateUserAction));
    router.delete('/user/:id', this.actionRunner(actions.RemoveUserAction));

    router.post('/user/change-password', this.actionRunner(actions.ChangePasswordAction));
    router.post('/user/send-reset-password-email', this.actionRunner(actions.SendResetPasswordEmailAction));
    router.post('/user/reset-password', this.actionRunner(actions.ResetPasswordAction));

    router.post('/user/confirm-registration', this.actionRunner(actions.ConfirmRegistrationAction));
    router.post('/user/change-email', this.actionRunner(actions.ChangeEmailAction));
    router.post('/user/confirm-email', this.actionRunner(actions.ConfirmEmailAction));
    router.post('/user/resend-confirm-new-email-token', this.actionRunner(actions.ResendConfirmNewEmailTokenAction));
    router.post('/user/cancel-email-changing', this.actionRunner(actions.CancelEmailChangingAction));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { UsersController };
