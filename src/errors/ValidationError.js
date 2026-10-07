const AppError = require('./AppError');

const BAD_REQUEST_STATUS = 400;

class ValidationError extends AppError {
  constructor(message = 'Invalid request', options) {
    super(message, BAD_REQUEST_STATUS, options);
  }
}

module.exports = ValidationError;
