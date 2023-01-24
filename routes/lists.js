const express = require('express');

const authController = require('../controllers/authController');
const listController = require('../controllers/listController');

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

module.exports = router;
