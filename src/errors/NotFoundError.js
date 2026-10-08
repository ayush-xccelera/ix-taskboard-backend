const AppError = require('./AppError');

const NOT_FOUND_STATUS = 404;

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options) {
    super(message, NOT_FOUND_STATUS, options);
  }
}

module.exports = NotFoundError;
