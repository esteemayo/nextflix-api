const createSendToken = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: true,
    signed: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwtToken', token, cookieOptions);

  const { password, ...rest } = user._doc;

  res.status(statusCode).json({
    status: 'success',
    token,
    user: rest,
  });
};

module.exports = createSendToken;
