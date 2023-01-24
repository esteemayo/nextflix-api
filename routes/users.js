import express from 'express';

import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.register);

router.use(authController.protect);

router.get('/stats', userController.getUserStats);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/update-me', userController.updateMe);

router.delete('/delete-me', userController.deleteMe);

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

export default router;
