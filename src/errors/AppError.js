/**
 * Base class for every domain exception the app throws. Carries the HTTP
 * status it should map to, so the centralized error handler never has to
 * guess a status code from a generic Error/message string.
 */
class AppError extends Error {
  constructor(message, statusCode, options) {
    super(message, options);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
