const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPasword);

router.post('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
