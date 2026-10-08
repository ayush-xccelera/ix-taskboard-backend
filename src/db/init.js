const pool = require('../config/db');
const logger = require('../utils/logger');

const CREATE_TASKS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (char_length(title) <= 100),
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

/**
 * Creates the tasks table if it does not already exist, so the app can boot
 * cleanly against a brand-new, empty database.
 *
 * @returns {Promise<void>} resolves once the schema is confirmed ready.
 * @throws {Error} if the schema cannot be created, with the original DB error
 *   preserved as `cause`.
 */
async function initDb() {
  try {
    await pool.query(CREATE_TASKS_TABLE_SQL);
    logger.info('Database schema verified: tasks table is ready');
  } catch (error) {
    throw new Error('Failed to initialize database schema', { cause: error });
  }
}

module.exports = initDb;
