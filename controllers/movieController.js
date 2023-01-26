import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';

import Movie from '../models/Movie.js';
import APIFeatures from '../utils/apiFeatures.js';
import asyncMiddleware from '../utils/asyncMiddleware.js';
import NotFoundError from '../errors/notFound.js';

const getAllMovies = asyncMiddleware(async (req, res, next) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: movies.length,
    requestedAt: req.requestTime,
    movies,
  });
});

const getMovieById = asyncMiddleware(async (req, res, next) => {
  const { id: movieID } = req.params;

  const movie = await Movie.findById(movieID);

  if (!movie) {
    return next(new NotFoundError(`No movie found with that ID → ${movieID}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    movie,
  });
});

const getMovieBySlug = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const movie = await Movie.findOne({ slug });

  if (!movie) {
    return next(new NotFoundError(`No movie found with that SLUG → ${slug}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    movie,
  });
});

const getRandomMovies = asyncMiddleware(async (req, res, next) => {
  const { type } = req.query;
  let movie;

  if (type === 'series') {
    movie = await Movie.aggregate([
      {
        $match: { isSeries: true },
      },
      {
        $sample: { size: 1 },
      },
    ]);
  } else {
    movie = await Movie.aggregate([
      {
        $match: { isSeries: false },
      },
      {
        $sample: { size: 1 },
      },
    ]);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    movie,
  });
});

const searchMovies = asyncMiddleware(async (req, res, next) => {
  const movies = await Movie.find(
    {
      $text: {
        $search: req.query.q,
      },
    },
    {
      score: {
        $meta: 'textScore',
      },
    }
  )
    .sort({
      score: {
        $meta: 'textScore',
      },
    })
    .limit(10);

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: movies.length,
    movies,
  });
});

const createMovie = asyncMiddleware(async (req, res, next) => {
  const movie = await Movie.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    movie,
  });
});

const updateMovie = asyncMiddleware(async (req, res, next) => {
  const { id: movieID } = req.params;

  if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true });

  const movie = await Movie.findByIdAndUpdate(
    movieID,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!movie) {
    return next(new NotFoundError(`No movie found with that ID → ${movieID}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    movie,
  });
});

const deleteMovie = asyncMiddleware(async (req, res, next) => {
  const { id: movieID } = req.params;

  const movie = await Movie.findByIdAndDelete(movieID);

  if (!movie) {
    return next(new NotFoundError(`No movie found with that ID → ${movieID}`));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    movie: null,
  });
});

const movieController = {
  getAllMovies,
  getMovieById,
  getMovieBySlug,
  getRandomMovies,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
};

export default movieController;
