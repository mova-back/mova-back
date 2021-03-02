const express = require('express');

const router = express.Router();

const jwtMiddleware = require('../../middlewares/jwtMiddleware');
const userController = require('./user.controller');
const { PRE_UR, UR, MR, AR } = require('../../constants');

router
  .route('/user')
  .get(jwtMiddleware.authByRole([PRE_UR, UR, MR, AR]), userController.getUser)
  .post(userController.registerUser)
  .put(jwtMiddleware.authByRole([UR, MR, AR]), userController.updateUser);
router.route('/user/login').post(userController.loginUser);
router.route('/user/refresh').post(userController.updateToken);
router
  .route('/user/logout')
  .post(jwtMiddleware.authByRole([PRE_UR, UR, MR, AR]), userController.logout);
router
  .route('/user/change-password')
  .put(jwtMiddleware.authByRole([PRE_UR, UR, MR, AR]), userController.changePassword);
router
  .route('/user/send-user-verification-email')
  .get(jwtMiddleware.authByRole([PRE_UR]), userController.sendVerifyEmail);
router.route('/user/verify_email/:userId/:secretCode').get(userController.verifyEmail);
router.route('/user/send-password-reset-email').post(userController.resetPasswordByEmail);

module.exports = router;
