const defaultTaskModel = require('../models/taskModel');
const { validateCreate, validateUpdate } = require('../validation/taskValidation');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const TASK_NOT_FOUND_MESSAGE = 'Task not found';
const NUMERIC_ID_PATTERN = /^\d+$/;

/**
 * Business layer for tasks: orchestrates validation and persistence, and is
 * the single place that decides when a lookup becomes a 404 vs a 400.
 * The data-access collaborator is injected (defaulting to the real model)
 * so this class can be unit-tested against a fake without touching Postgres.
 */
class TaskService {
  #model;

  constructor({ model = defaultTaskModel } = {}) {
    this.#model = model;
  }

  /**
   * @param {number|string} id
   * @returns {number} the id parsed as an integer.
   * @throws {NotFoundError} if the id is not a valid positive integer.
   */
  #parseId(id) {
    if (!NUMERIC_ID_PATTERN.test(String(id))) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }
    return Number(id);
  }

  async listTasks() {
    return this.#model.listTasks();
  }

  async createTask(payload) {
    const validation = validateCreate(payload);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }
    return this.#model.createTask(validation.data);
  }

  async getTask(id) {
    const taskId = this.#parseId(id);
    const task = await this.#model.getTaskById(taskId);
    if (!task) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }
    return task;
  }

  async updateTask(id, payload) {
    const taskId = this.#parseId(id);
    const validation = validateUpdate(payload);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const updated = await this.#model.updateTask(taskId, validation.data);
    if (!updated) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }
    return updated;
  }

  async deleteTask(id) {
    const taskId = this.#parseId(id);
    const deleted = await this.#model.deleteTask(taskId);
    if (!deleted) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }
  }
}

module.exports = TaskService;
