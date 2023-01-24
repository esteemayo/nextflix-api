import express from 'express';

import authController from '../controllers/authController.js';
import movieController from '../controllers/movieController.js';

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin', 'user'), movieController.getAllMovies)
  .post(authController.restrictTo('admin'), movieController.createMovie);

router
  .route('/:id')
  .patch(authController.restrictTo('admin'), movieController.updateMovie)
  .delete(authController.restrictTo('admin'), movieController.deleteMovie);

router.get('/find/:id', movieController.getMovieById);

router.get('/random', movieController.getRandomMovies);

router.get(
  '/details/:slug',
  movieController.getMovieBySlug
);

router.get('/search', movieController.searchMovies);

export default router;
