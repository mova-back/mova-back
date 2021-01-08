const express = require('express');

const router = express.Router();

const jwtMiddleware = require('../../middlewares/jwtMiddleware');
const userController = require('./user.controller');
const { PRE_UR, UR } = require('../../constants');

router
  .route('/user')
  .post(userController.registerUser)
  .get(jwtMiddleware.authByRole(UR), userController.getUser);
router.route('/user/login').post(userController.loginUser);
router.route('/user/refresh').post(userController.updateToken);
router.route('/user/logout').post(userController.logout);
router
  .route('/user/send-user-verification-email')
  .post(jwtMiddleware.authByRole(PRE_UR), userController.sendVerifyEmail);
router.route('/user/verify_email:userId/:secretCode').post(userController.verifyEmail);
router.route('/user/send-password-reset-email').get(userController.resetPasswordByEmail);

module.exports = router;
