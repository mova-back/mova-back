const { RootController } = require('../resources/user/user.controller');
const { AuthController } = require('../modules/auth/AuthController');

module.exports = [RootController, AuthController];
