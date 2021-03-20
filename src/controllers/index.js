const { AuthController } = require('../resources/modules/auth/AuthController');
const { UsersController } = require('../resources/modules/users/UsersController');
const { RootController } = require('../resources/modules/root/RootController');
const { WordsController } = require('../resources/modules/words/WordsController');

module.exports = [AuthController, UsersController, RootController, WordsController];
