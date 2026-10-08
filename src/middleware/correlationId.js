const crypto = require('crypto');

const CORRELATION_HEADER_CANDIDATES = ['x-request-id', 'x-correlation-id'];
const CORRELATION_RESPONSE_HEADER = 'X-Correlation-Id';

/**
 * Reads a correlation id from the incoming request (X-Request-ID or
 * X-Correlation-ID), or generates one. Attaches it to `req.correlationId` so
 * every log line and error response for this request can reference the same
 * id, and echoes it back on the response.
 */
function correlationIdMiddleware(req, res, next) {
  const incomingId = CORRELATION_HEADER_CANDIDATES
    .map((header) => req.headers[header])
    .find(Boolean);
  const correlationId = incomingId || crypto.randomUUID();

  req.correlationId = correlationId;
  res.setHeader(CORRELATION_RESPONSE_HEADER, correlationId);
  next();
}

module.exports = correlationIdMiddleware;
