/**
 * Hand-written OpenAPI 3 document covering every route this service exposes.
 * Served as JSON at /openapi.json and rendered as Swagger UI at /docs.
 * Keep this in sync whenever a route is added or changed.
 */
const taskSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    title: { type: 'string', example: 'Write project report' },
    description: { type: 'string', nullable: true, example: 'Due end of week' },
    priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
    completed: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Task not found' },
  },
};

const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Taskboard API',
    version: '1.0.0',
    description: 'REST API for managing taskboard tasks.',
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is healthy',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } },
          },
        },
      },
    },
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is healthy',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } },
          },
        },
      },
    },
    '/api/tasks': {
      get: {
        summary: 'List tasks',
        responses: {
          200: {
            description: 'Array of tasks, newest first',
            content: { 'application/json': { schema: { type: 'array', items: taskSchema } } },
          },
        },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', maxLength: 100 },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Task created', content: { 'application/json': { schema: taskSchema } } },
          400: { description: 'Invalid input', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get a task by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task found', content: { 'application/json': { schema: taskSchema } } },
          404: { description: 'Task not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      put: {
        summary: 'Partially update a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', maxLength: 100 },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  completed: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Task updated', content: { 'application/json': { schema: taskSchema } } },
          400: { description: 'Invalid input', content: { 'application/json': { schema: errorSchema } } },
          404: { description: 'Task not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      delete: {
        summary: 'Delete a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Task deleted' },
          404: { description: 'Task not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
  },
};

module.exports = openapiSpec;
