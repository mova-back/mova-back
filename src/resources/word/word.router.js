const router = require('express').Router();

const wordController = require('./word.controller');

router.route('/word').post(wordController.createWord).get(wordController.getAllWords);

router
  .route('/word/:id')
  .get(wordController.getWordById)
  .put(wordController.updateWord)
  .delete(wordController.deleteWord);

module.exports = router;
