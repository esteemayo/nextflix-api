const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./customAPIError');

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.FORBIDDEN;
    this.status = 'fail';
  }
}

module.exports = ForbiddenError;
