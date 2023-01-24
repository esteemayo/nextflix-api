const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const factory = require('./handlerFactory');
const BadRequestError = require('../errors/badRequest');
const asyncMiddleware = require('../utils/asyncMiddleware');
const createSendToken = require('../middlewares/createSendToken');

exports.register = asyncMiddleware(async (req, res, next) => {
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

exports.updateMe = asyncMiddleware(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use update ${
          req.protocol
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

exports.deleteMe = asyncMiddleware(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    user: null,
  });
});

exports.getAllUsers = asyncMiddleware(async (req, res, next) => {
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

exports.getUserStats = asyncMiddleware(async (req, res, next) => {
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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/register instead`,
  });
};

exports.getUser = factory.getOneById(User);
// do NOT update password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
