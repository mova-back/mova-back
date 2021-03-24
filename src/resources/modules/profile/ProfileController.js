const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class ProfilesController extends BaseController {
  get router() {
    router.get('/api/profile/favorites', this.actionRunner(actions.FavoriteListAction));
    router.put('/api/profile/addfavorite/:id', this.actionRunner(actions.AddFavoriteAction));
    router.put('/api/profile/removefavorite/:id', this.actionRunner(actions.RemoveFavoriteAction));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { ProfilesController };
