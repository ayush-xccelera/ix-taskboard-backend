const { Pool } = require('pg');

/**
 * Single, shared PostgreSQL connection pool for the whole app.
 * DATABASE_URL is the sole source of connection configuration - never hardcode
 * host/user/password here, so the same code runs unchanged across environments.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
