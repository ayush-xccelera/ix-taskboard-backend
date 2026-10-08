/**
 * Wraps an async Express route handler so a rejected promise is forwarded to
 * `next(error)` instead of becoming an unhandled rejection - keeps routes
 * free of repetitive try/catch blocks around every awaited call.
 *
 * @param {(req: object, res: object, next: function) => Promise<void>} handler
 */
function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
