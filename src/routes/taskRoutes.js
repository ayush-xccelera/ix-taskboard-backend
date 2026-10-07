const express = require('express');

const TaskService = require('../services/taskService');
const serializeTask = require('../utils/serializeTask');
const asyncHandler = require('../middleware/asyncHandler');
const logger = require('../utils/logger');

const router = express.Router();
const taskService = new TaskService();

const NO_CONTENT_STATUS = 204;

/**
 * GET /api/tasks -> list every task, newest first.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tasks = await taskService.listTasks();
    res.status(200).json(tasks.map(serializeTask));
  })
);

/**
 * POST /api/tasks -> create a task.
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body);
    logger.info({ correlationId: req.correlationId, taskId: task.id }, 'Task created');
    res.status(201).json(serializeTask(task));
  })
);

/**
 * GET /api/tasks/:id -> fetch a single task.
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await taskService.getTask(req.params.id);
    res.status(200).json(serializeTask(task));
  })
);

/**
 * PUT /api/tasks/:id -> partially update a task.
 */
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    logger.info({ correlationId: req.correlationId, taskId: task.id }, 'Task updated');
    res.status(200).json(serializeTask(task));
  })
);

/**
 * DELETE /api/tasks/:id -> remove a task.
 */
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    logger.info({ correlationId: req.correlationId, taskId: req.params.id }, 'Task deleted');
    res.status(NO_CONTENT_STATUS).send();
  })
);

module.exports = router;
