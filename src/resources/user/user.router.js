const express = require('express');

const router = express.Router();

const userController = require('./user.controller');

router
  .route('/user')
  .post(userController.registerUser)
  .get(userController.getUser)
  .put(userController.updateUser);
router.route('/user/login').post(userController.loginUser);
router.route('/user/refresh').post(userController.updateToken);

module.exports = router;
