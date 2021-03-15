const { AuthController } = require('../resources/modules/auth/AuthController');
const { UsersController } = require('../resources/modules/users/UsersController');

module.exports = [AuthController, UsersController];
