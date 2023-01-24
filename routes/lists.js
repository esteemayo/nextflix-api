import express from 'express';

import authController from '../controllers/authController.js';
import listController from '../controllers/listController.js';

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(listController.getAllLists)
  .post(authController.restrictTo('admin'), listController.createList);

router
  .route('/:id')
  .get(listController.getList)
  .patch(authController.restrictTo('admin'), listController.updateList)
  .delete(authController.restrictTo('admin'), listController.deleteList);

export default router;
