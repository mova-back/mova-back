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

module.exports = router;
