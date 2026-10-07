const pino = require('pino');

/**
 * Single structured logger instance for the whole application.
 * Never use console.log for application events - route everything through here
 * so log level, correlation IDs, and output shape stay consistent.
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
