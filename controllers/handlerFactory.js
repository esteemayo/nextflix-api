import { StatusCodes } from 'http-status-codes';

import APIFeatures from '../utils/apiFeatures.js';
import asyncMiddleware from '../utils/asyncMiddleware.js';
import NotFoundError from '../errors/notFound.js';

const getAll = (Model) =>
  asyncMiddleware(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;
    // const docs = await features.query.explain();

    res.status(StatusCodes.OK).json({
      status: 'success',
      nbHits: docs.length,
      requestedAt: req.requestTime,
      docs,
    });
  });

const getOneById = (Model) =>
  asyncMiddleware(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findById(docID);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID → ${docID}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

const getOneBySlug = (Model) =>
  asyncMiddleware(async (req, res, next) => {
    const { slug } = req.params;

    const doc = await Model.findOne(slug);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that SLUG → ${slug}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

const createOne = (Model) =>
  asyncMiddleware(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      doc,
    });
  });

const updateOne = (Model) =>
  asyncMiddleware(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findByIdAndUpdate(
      docID,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID → ${docID}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

const deleteOne = (Model) =>
  asyncMiddleware(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findByIdAndDelete(docID);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID → ${docID}`)
      );
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      doc: null,
    });
  });


const factory = {
  getAll,
  getOneById,
  getOneBySlug,
  createOne,
  updateOne,
  deleteOne,
};

export default factory;
