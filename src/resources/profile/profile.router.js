const express = require('express');

const router = express.Router();

const profileController = require('./profile.controller');
const { authByRole } = require('../../middlewares/jwtMiddleware');
const { UR, AR, MR } = require('../../constants');

router.route('/:username').get(authByRole([UR, MR, AR]), profileController.getProfile);
router.route('/:username/follow').post(authByRole([UR, MR, AR]), profileController.followUser);
router
  .route('/:username/unfollow')
  .delete(authByRole([UR, MR, AR]), profileController.unFollowUser);
router.route('/:username/promote').put(authByRole([AR]), profileController.promoteToModerator);

module.exports = router;
