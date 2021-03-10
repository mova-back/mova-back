const router = require('express').Router();

const jwtMiddleware = require('../../middlewares/jwtMiddleware');
const wordController = require('./word.controller');
const { UR, MR, AR } = require('../../constants');

router
  .route('/word')
  .post(jwtMiddleware.authByRole([UR, MR, AR]), wordController.createWord)
  .get(jwtMiddleware.authByRole([UR, MR, AR]), wordController.getAllWords);

router.route('/feed').get(wordController.feedWords);

router
  .route('/word/:id')
  .get(jwtMiddleware.authByRole([UR, MR, AR]), wordController.getWordById)
  .put(jwtMiddleware.authByRole([UR, MR, AR]), wordController.updateWord)
  .delete(jwtMiddleware.authByRole([UR, MR, AR]), wordController.deleteWord);

router.route('/word/:id/like').put(jwtMiddleware.authByRole([UR, MR, AR]), wordController.likeWord);
router.route('/word/:id/dislike').put(jwtMiddleware.authByRole([UR, MR, AR]), wordController.dislikeWord);

router.route('/word/:id/favorite').post(jwtMiddleware.authByRole([UR, MR, AR]), wordController.favoriteWord);
router.route('/word/:id/unfavorite').delete(jwtMiddleware.authByRole([UR, MR, AR]), wordController.unfavoriteWord);

module.exports = router;
