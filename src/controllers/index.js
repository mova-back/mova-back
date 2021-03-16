const { AuthController } = require('../resources/modules/auth/AuthController');
const { UsersController } = require('../resources/modules/users/UsersController');
const { RootController } = require('../resources/modules/root/RootController');

module.exports = [AuthController, UsersController, RootController];
