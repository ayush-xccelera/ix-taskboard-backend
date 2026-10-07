const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');
const correlationIdMiddleware = require('./middleware/correlationId');
const errorHandler = require('./middleware/errorHandler');
const openapiSpec = require('./openapi');

const NOT_FOUND_STATUS = 404;

/**
 * Builds the configured Express app. Does not call listen() - that is
 * server.js's job, so the app itself stays importable/testable on its own.
 */
const app = express();

app.use(cors());
app.use(express.json());
app.use(correlationIdMiddleware);

// Deploy-contract routes: unauthenticated health probe + API docs.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/openapi.json', (req, res) => {
  res.json(openapiSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(NOT_FOUND_STATUS).json({ error: 'Not found' });
});

// Centralized error handler - must be mounted last, after every route.
app.use(errorHandler);

module.exports = app;
