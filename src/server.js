require('dotenv').config();

const app = require('./app');
const initDb = require('./db/init');
const logger = require('./utils/logger');

const DEFAULT_PORT = 5000;
const port = process.env.PORT || DEFAULT_PORT;

/**
 * Entry point: initializes the database schema, then starts listening.
 * Exits the process if either step fails, so a broken boot is never silent.
 */
async function start() {
  try {
    await initDb();
    app.listen(port, () => {
      logger.info(`Taskboard API listening on port ${port}`);
    });
  } catch (error) {
    logger.error(
      { errorMessage: error.message, cause: error.cause?.message },
      'Failed to start server'
    );
    process.exit(1);
  }
}

start();
