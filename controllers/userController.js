import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import factory from './handlerFactory.js';
import BadRequestError from '../errors/badRequest.js';
import asyncMiddleware from '../utils/asyncMiddleware.js';
import createSendToken from '../middlewares/createSendToken.js';

const register = asyncMiddleware(async (req, res, next) => {
  const newUser = _.pick(req.body, [
    'email',
    'role',
    'avatar',
    'username',
    'password',
    'confirmPassword',
    'passwordChangedAt',
  ]);

  const user = await User.create({ ...newUser });

  createSendToken(user, StatusCodes.CREATED, res);
});

const updateMe = asyncMiddleware(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use update ${req.protocol
        }://${req.get('host')}/api/v1/auth/update-my-password`
      )
    );
  }

  const filterBody = _.pick(req.body, ['email', 'avatar', 'username']);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...filterBody } },
    {
      new: true,
      runValidators: true,
    }
  );

  createSendToken(updatedUser, StatusCodes.OK, res);
});

const deleteMe = asyncMiddleware(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    user: null,
  });
});

const getAllUsers = asyncMiddleware(async (req, res, next) => {
  const query = req.query.new;

  const users = query
    ? await User.find().sort('-_id').limit(5)
    : await User.find();

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: users.length,
    requestedAt: req.requestTime,
    users,
  });
});

const getUserStats = asyncMiddleware(async (req, res, next) => {
  const now = new Date();
  const lastYear = new Date(now.setFullYear(now.getFullYear() - 1));
  const monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const stats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear },
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    stats,
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/register instead`,
  });
};

const getUser = factory.getOneById(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const userController = {
  register,
  getAllUsers,
  getMe,
  getUser,
  getUserStats,
  createUser,
  updateMe,
  updateUser,
  deleteMe,
  deleteUser,
};

export default userController;
