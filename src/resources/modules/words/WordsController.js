const router = require('express').Router();

const actions = require('./actions');
const { BaseController } = require('../../../root');

class WordsController extends BaseController {
  get router() {
    router.get('/api/words', this.actionRunner(actions.ListWordsAction));
    router.get('/api/word/:id', this.actionRunner(actions.GetWordByIdAction));
    router.post('/api/word', this.actionRunner(actions.CreateWordAction));
    router.put('/api/word/like/:id', this.actionRunner(actions.AddLikeAction));
    router.put('/api/word/dislike/:id', this.actionRunner(actions.AddDislikeAction));
    router.put('/api/word/removelike/:id', this.actionRunner(actions.RemoveLikeAction));

    router.patch('/api/word/:id', this.actionRunner(actions.UpdateWordAction));
    router.delete('/api/word/:id', this.actionRunner(actions.RemoveWordAction));

    return router;
  }

  async init() {
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = { WordsController };
