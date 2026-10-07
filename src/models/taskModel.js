const pool = require('../config/db');

const TASK_COLUMNS = 'id, title, description, priority, completed, created_at';

const UPDATABLE_COLUMN_BY_FIELD = {
  title: 'title',
  description: 'description',
  priority: 'priority',
  completed: 'completed',
};

/**
 * Lists every task, newest first.
 * @returns {Promise<object[]>} raw DB rows (snake_case columns).
 */
async function listTasks() {
  const result = await pool.query(
    `SELECT ${TASK_COLUMNS} FROM tasks ORDER BY created_at DESC`
  );
  return result.rows;
}

/**
 * Inserts a new task row.
 * @param {{title:string, description:?string, priority:string}} fields
 * @returns {Promise<object>} the created row.
 */
async function createTask({ title, description, priority }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority)
     VALUES ($1, $2, $3)
     RETURNING ${TASK_COLUMNS}`,
    [title, description ?? null, priority]
  );
  return result.rows[0];
}

/**
 * Looks up a task by id.
 * @param {number|string} id
 * @returns {Promise<object|undefined>} the row, or undefined if not found.
 */
async function getTaskById(id) {
  const result = await pool.query(
    `SELECT ${TASK_COLUMNS} FROM tasks WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

/**
 * Applies a partial update to a task.
 * @param {number|string} id
 * @param {object} fields - any subset of {title, description, priority, completed}.
 * @returns {Promise<object|undefined>} the updated row, or undefined if not found.
 */
async function updateTask(id, fields) {
  const presentFields = Object.keys(fields).filter((field) => field in UPDATABLE_COLUMN_BY_FIELD);

  if (presentFields.length === 0) {
    return getTaskById(id);
  }

  const setClauses = presentFields.map(
    (field, index) => `${UPDATABLE_COLUMN_BY_FIELD[field]} = $${index + 1}`
  );
  const values = presentFields.map((field) => fields[field]);
  values.push(id);

  const result = await pool.query(
    `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = $${values.length}
     RETURNING ${TASK_COLUMNS}`,
    values
  );
  return result.rows[0];
}

/**
 * Deletes a task by id.
 * @param {number|string} id
 * @returns {Promise<boolean>} true if a row was deleted.
 */
async function deleteTask(id) {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = { listTasks, createTask, getTaskById, updateTask, deleteTask };
