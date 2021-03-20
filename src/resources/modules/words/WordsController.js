const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class WordsController extends BaseController {
  get router() {
    router.get('/api/words', this.actionRunner(actions.ListWordsAction));
    router.post('/api/word', this.actionRunner(actions.CreateWordAction));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { WordsController };
