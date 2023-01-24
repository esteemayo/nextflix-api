import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import movieController from '../controllers/movieController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin', 'user'), movieController.getAllMovies)
  .post(authMiddleware.restrictTo('admin'), movieController.createMovie);

router
  .route('/:id')
  .patch(authMiddleware.restrictTo('admin'), movieController.updateMovie)
  .delete(authMiddleware.restrictTo('admin'), movieController.deleteMovie);

router.get('/find/:id', movieController.getMovieById);

router.get('/random', movieController.getRandomMovies);

router.get('/details/:slug', movieController.getMovieBySlug);

router.get('/search', movieController.searchMovies);

export default router;
