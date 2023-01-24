import { StatusCodes } from 'http-status-codes';

import List from '../models/List.js';
import asyncMiddleware from '../utils/asyncMiddleware.js';
import NotFoundError from '../errors/notFound.js';

exports.getAllLists = asyncMiddleware(async (req, res, next) => {
  const { type, genre } = req.query;
  let lists = [];

  if (type) {
    if (genre) {
      lists = await List.aggregate([
        {
          $sample: { size: 10 },
        },
        {
          $match: { type, genre },
        },
      ]);
    } else {
      lists = await List.aggregate([
        {
          $sample: { size: 10 },
        },
        {
          $match: { type },
        },
      ]);
    }
  } else {
    lists = await List.aggregate([
      {
        $sample: { size: 10 },
      },
    ]);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: lists.length,
    requestedAt: req.requestTime,
    lists,
  });
});

exports.getList = asyncMiddleware(async (req, res, next) => {
  const { id: listID } = req.params;

  const list = await List.findById(listID);

  if (!list) {
    return next(new NotFoundError(`No list found with that ID → ${listID}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    list,
  });
});

exports.createList = asyncMiddleware(async (req, res, next) => {
  const list = await List.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    list,
  });
});

exports.updateList = asyncMiddleware(async (req, res, next) => {
  const { id: listID } = req.params;

  const list = await List.findByIdAndUpdate(
    listID,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!list) {
    return next(new NotFoundError(`No list found with that ID → ${listID}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    list,
  });
});

exports.deleteList = asyncMiddleware(async (req, res, next) => {
  const { id: listID } = req.params;

  const list = await List.findByIdAndDelete(listID);

  if (!list) {
    return next(new NotFoundError(`No list found with that ID → ${listID}`));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    list: null,
  });
});
