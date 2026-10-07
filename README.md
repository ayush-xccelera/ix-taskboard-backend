# Taskboard API

A REST API backend for a Taskboard application, built with Node.js, Express,
and PostgreSQL (via the native `pg` driver, no ORM).

## Prerequisites

- Node.js 18 or later (built-in `fetch` is used by the smoke test)
- PostgreSQL 13+ (or use the provided `docker-compose.yml`)
- Docker + Docker Compose (optional, for containerized run)

## Setup

1. Copy the example environment file and adjust as needed:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` to set `DATABASE_URL` (and `PORT` if you don't want the
   default `5000`):

   ```
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/taskboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server (creates the `tasks` table automatically on an empty
   database):

   ```bash
   npm start
   ```

4. Run the smoke tests against the running server:

   ```bash
   npm test
   ```

## Running with Docker Compose

```bash
docker compose up --build
```

This starts the API on `http://localhost:8000` and a PostgreSQL instance.

## API Endpoints

| Method | Path              | Description                                  |
|--------|-------------------|-----------------------------------------------|
| GET    | `/api/health`     | Health check, returns `{"status":"ok"}`      |
| GET    | `/api/tasks`      | List all tasks, newest first                 |
| POST   | `/api/tasks`      | Create a task                                |
| GET    | `/api/tasks/:id`  | Get a task by id                             |
| PUT    | `/api/tasks/:id`  | Partially update a task                      |
| DELETE | `/api/tasks/:id`  | Delete a task                                |
| GET    | `/health`         | Alias health check (deploy-platform probe)   |
| GET    | `/docs`           | Swagger UI                                   |
| GET    | `/openapi.json`   | OpenAPI 3 specification (JSON)               |

### Task JSON shape

```json
{
  "id": 1,
  "title": "Write project report",
  "description": "Due end of week",
  "priority": "medium",
  "completed": false,
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

`priority` is one of `low`, `medium`, `high` (defaults to `medium`).
`title` is required, non-empty, and at most 100 characters.

### Error responses

Validation failures return `400` with `{"error": "<message>"}`.
Missing resources return `404` with `{"error": "Task not found"}`.
Every response also carries an `X-Correlation-Id` header for tracing.

## Environment Variables

| Variable       | Default | Description                              |
|----------------|---------|-------------------------------------------|
| `PORT`         | `5000`  | Port the HTTP server listens on          |
| `DATABASE_URL` | -       | PostgreSQL connection string (required)  |

## Architecture

- `src/routes` - thin Express routers; parse/validate the request shape and
  delegate to the service layer.
- `src/services` - business logic and orchestration (`TaskService`).
- `src/models` - data access via parameterized SQL (`pg`), raw snake_case rows.
- `src/utils/serializeTask.js` - DTO mapper from DB rows to the public JSON shape.
- `src/validation` - pure request-payload validators.
- `src/errors` - domain exceptions (`NotFoundError`, `ValidationError`).
- `src/middleware/errorHandler.js` - single centralized error-to-response mapper.
