const express = require('express');

const router = express.Router();

const jwtMiddleware = require('../../middlewares/jwtMiddleware');
const userController = require('./user.controller');

router
  .route('/user')
  .post(userController.registerUser)
  .get(userController.getUser, jwtMiddleware.auth);
router.route('/user/login').post(userController.loginUser);
router.route('/user/refresh').post(userController.updateToken);
router.route('/user/logout').post(userController.logout);
router
  .route('/user/send-user-verification-email')
  .post(userController.sendVerifyEmail, jwtMiddleware.authWhilePending);
router.route('/user/verify_email:userId/:secretCode').post(userController.verifyEmail);

module.exports = router;
