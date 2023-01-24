import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import listController from '../controllers/listController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(listController.getAllLists)
  .post(authMiddleware.restrictTo('admin'), listController.createList);

router
  .route('/:id')
  .get(listController.getList)
  .patch(authMiddleware.restrictTo('admin'), listController.updateList)
  .delete(authMiddleware.restrictTo('admin'), listController.deleteList);

export default router;
