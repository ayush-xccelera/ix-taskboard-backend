const TITLE_MAX_LENGTH = 100;
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const DEFAULT_PRIORITY = 'medium';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateTitle(title) {
  if (!isNonEmptyString(title)) {
    return 'Title is required and must be a non-empty string';
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return `Title must be at most ${TITLE_MAX_LENGTH} characters`;
  }
  return null;
}

function validatePriority(priority) {
  if (!VALID_PRIORITIES.includes(priority)) {
    return `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }
  return null;
}

function validateCompleted(completed) {
  if (typeof completed !== 'boolean') {
    return 'Completed must be a boolean';
  }
  return null;
}

/**
 * Validates the payload for creating a task.
 *
 * @param {object} body
 * @returns {{valid:true,data:{title:string,description:?string,priority:string}}|{valid:false,error:string}}
 */
function validateCreate(body = {}) {
  const titleError = validateTitle(body.title);
  if (titleError) {
    return { valid: false, error: titleError };
  }

  const priority = body.priority === undefined ? DEFAULT_PRIORITY : body.priority;
  const priorityError = validatePriority(priority);
  if (priorityError) {
    return { valid: false, error: priorityError };
  }

  return {
    valid: true,
    data: {
      title: body.title,
      description: body.description ?? null,
      priority,
    },
  };
}

/**
 * Validates a partial payload for updating a task. Only fields present on the
 * body are validated and returned; unknown fields are ignored.
 *
 * @param {object} body
 * @returns {{valid:true,data:object}|{valid:false,error:string}}
 */
function validateUpdate(body = {}) {
  const data = {};

  if (body.title !== undefined) {
    const titleError = validateTitle(body.title);
    if (titleError) {
      return { valid: false, error: titleError };
    }
    data.title = body.title;
  }

  if (body.description !== undefined) {
    data.description = body.description;
  }

  if (body.priority !== undefined) {
    const priorityError = validatePriority(body.priority);
    if (priorityError) {
      return { valid: false, error: priorityError };
    }
    data.priority = body.priority;
  }

  if (body.completed !== undefined) {
    const completedError = validateCompleted(body.completed);
    if (completedError) {
      return { valid: false, error: completedError };
    }
    data.completed = body.completed;
  }

  return { valid: true, data };
}

module.exports = { validateCreate, validateUpdate };
