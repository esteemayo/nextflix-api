const createSendToken = (user, statusCode, req, res) => {
  const token = user.generateAuthToken();

  res.cookie('jwtToken', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  const { password, role, ...rest } = user._doc;

  const details = {
    token,
    ...rest,
  };

  res.status(statusCode).json({
    status: 'success',
    details,
    role,
  });
};

export default createSendToken;
