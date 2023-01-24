import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.register);

router.use(authMiddleware.protect);

router.get('/stats', userController.getUserStats);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/update-me', userController.updateMe);

router.delete('/delete-me', userController.deleteMe);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(authMiddleware.verifyUser, userController.getUser)
  .patch(authMiddleware.restrictTo('admin'), userController.updateUser)
  .delete(authMiddleware.restrictTo('admin'), userController.deleteUser);

export default router;
