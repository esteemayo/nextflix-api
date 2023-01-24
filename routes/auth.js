import express from 'express';

import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPasword);

router.post('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword
);

export default router;
