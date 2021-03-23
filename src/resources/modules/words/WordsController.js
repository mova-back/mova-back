const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class WordsController extends BaseController {
  get router() {
    router.get('/api/words', this.actionRunner(actions.ListWordsAction));
    router.get('/api/word/:id', this.actionRunner(actions.GetWordByIdAction));
    router.post('/api/word', this.actionRunner(actions.CreateWordAction));
    router.patch('/api/words/:id', this.actionRunner(actions.UpdateWordAction));
    router.delete('/api/words/:id', this.actionRunner(actions.RemoveWordAction));
    // router.post('/api/words/like', this.actionRunner(actions.addLikeAction));
    // router.post('/api/words/dislike', this.actionRunner(actions.addDislikeAction));
    // router.post('/api/words/removelike', this.actionRunner(actions.removeLike));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { WordsController };
