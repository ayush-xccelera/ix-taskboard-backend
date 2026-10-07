const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const DEFAULT_ERROR_MESSAGE = 'Internal server error';
const INTERNAL_SERVER_ERROR_STATUS = 500;

/**
 * Single, centralized place that turns any thrown/forwarded error into an
 * HTTP response. Mounted last, after every route, per the global error
 * handling contract.
 *
 * Response body intentionally stays `{ error: '<message>' }` to match this
 * API's documented contract; the correlation id (also present on every log
 * line below) is still surfaced to the client via the `X-Correlation-Id`
 * response header set earlier by correlationIdMiddleware, and a timestamp is
 * attached to the structured log line automatically. Internal details
 * (stack traces, raw SQL, file paths) are logged but never sent to clients.
 *
 * @param {Error} err
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isKnownError = err instanceof AppError;
  const statusCode = isKnownError ? err.statusCode : INTERNAL_SERVER_ERROR_STATUS;
  const clientMessage = isKnownError ? err.message : DEFAULT_ERROR_MESSAGE;

  logger.error(
    {
      correlationId: req.correlationId,
      statusCode,
      method: req.method,
      path: req.originalUrl,
      errorName: err.name,
      errorMessage: err.message,
      cause: err.cause?.message,
      stack: err.stack,
    },
    'Request failed'
  );

  res.status(statusCode).json({ error: clientMessage });
}

module.exports = errorHandler;
