const express = require('express');

const router = express.Router();

const profileController = require('./profile.conroller');
const { authByRole } = require('../../middlewares/jwtMiddleware');
const { UR, AR, MR } = require('../../constants');

router.route('/:username').get(authByRole([UR, MR, AR]), profileController.getProfile);
router.route('/:username/follow').post(authByRole([UR, MR, AR]), profileController.followUser);
router.route('/:username/follow').delete(authByRole([UR, MR, AR]), profileController.unFollowUser);
router.route('/:username/promote').post(authByRole([AR]), profileController.promoteToModerator);

module.exports = router;
