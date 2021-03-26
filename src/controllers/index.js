const { AuthController } = require('../resources/modules/auth/AuthController');
const { UsersController } = require('../resources/modules/users/UsersController');
const { RootController } = require('../resources/modules/root/RootController');
const { WordsController } = require('../resources/modules/words/WordsController');
const { ProfilesController } = require('../resources/modules/profile/ProfileController');
const { ReportController } = require('../resources/modules/report/ReportController');

module.exports = [AuthController, UsersController, RootController, WordsController, ProfilesController, ReportController];
