const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./customAPIError');

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = 'fail';
  }
}

module.exports = UnauthenticatedError;
