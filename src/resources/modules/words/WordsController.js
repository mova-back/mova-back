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
    router.put('/api/word/addfavorite/:id', this.actionRunner(actions.AddFavoriteAction));

    router.put('/api/word/removefavorite/:id', this.actionRunner(actions.RemoveFavoriteAction));

    router.patch('/api/word/:id', this.actionRunner(actions.UpdateWordAction));

    router.get('/api/word/reports', this.actionRunner(actions.ReportListAction));
    router.post('/api/word/addreport/:id', this.actionRunner(actions.AddReportAction));
    router.delete('/api/word/:id', this.actionRunner(actions.RemoveWordAction));
    router.put('/api/word/return/:id', this.actionRunner(actions.ReportListAction));

    return router;
  }

  async init() {
    this.logger.debug(`${this.constructor.name} initialized...`);
  }
}

module.exports = { WordsController };
