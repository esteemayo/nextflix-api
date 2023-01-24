const { StatusCodes } = require('http-status-codes');

const Movie = require('../models/Movie');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');
const asyncMiddleware = require('../utils/asyncMiddleware');

exports.getAllMovies = asyncMiddleware(async (req, res, next) => {
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

exports.getMovieById = asyncMiddleware(async (req, res, next) => {
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

exports.getMovieBySlug = asyncMiddleware(async (req, res, next) => {
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

exports.getRandomMovies = asyncMiddleware(async (req, res, next) => {
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

exports.searchMovies = asyncMiddleware(async (req, res, next) => {
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

exports.createMovie = asyncMiddleware(async (req, res, next) => {
  const movie = await Movie.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    movie,
  });
});

exports.updateMovie = asyncMiddleware(async (req, res, next) => {
  const { id: movieID } = req.params;

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

exports.deleteMovie = asyncMiddleware(async (req, res, next) => {
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
