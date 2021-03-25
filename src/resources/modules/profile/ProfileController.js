const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class ProfilesController extends BaseController {
  get router() {
    router.get('/api/profile/favorites', this.actionRunner(actions.FavoriteListAction));
    router.get('/api/profile/mywords', this.actionRunner(actions.MyWordsAction));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { ProfilesController };
