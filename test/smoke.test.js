/**
 * Standalone smoke test for the Taskboard API. Exercises the full task CRUD
 * lifecycle over HTTP against a running server. Uses the Node.js built-in
 * `fetch` (Node 18+) - no extra dependency required.
 *
 * Usage: `npm test` or `node test/smoke.test.js`
 * Exits 0 if every assertion passes, non-zero (with details) otherwise.
 */

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

let passedCount = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  passedCount += 1;
}

async function step(name, fn) {
  try {
    return await fn();
  } catch (error) {
    throw new Error(`[${name}] ${error.message}`, { cause: error });
  }
}

async function checkHealth() {
  return step('health check', async () => {
    const response = await fetch(`${BASE_URL}/health`);
    const body = await response.json();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(body.status === 'ok', `expected status "ok", got "${body.status}"`);
  });
}

async function createTask() {
  return step('create task', async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Smoke test task', priority: 'high' }),
    });
    const body = await response.json();
    assert(response.status === 201, `expected 201, got ${response.status}`);
    assert(typeof body.id === 'number', 'created task must have a numeric id');
    assert(body.title === 'Smoke test task', 'title must round-trip');
    assert(body.priority === 'high', 'priority must round-trip');
    assert(body.completed === false, 'completed must default to false');
    return body;
  });
}

async function listTasks(taskId) {
  return step('list tasks', async () => {
    const response = await fetch(`${BASE_URL}/tasks`);
    const body = await response.json();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(Array.isArray(body), 'response must be an array');
    assert(body.some((task) => task.id === taskId), 'created task must appear in the list');
  });
}

async function getTask(taskId) {
  return step('get task by id', async () => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`);
    const body = await response.json();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(body.id === taskId, 'returned task must match requested id');
  });
}

async function updateTask(taskId) {
  return step('update task', async () => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    const body = await response.json();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(body.completed === true, 'completed must be updated to true');
  });
}

async function deleteTask(taskId) {
  return step('delete task', async () => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, { method: 'DELETE' });
    assert(response.status === 204, `expected 204, got ${response.status}`);
  });
}

async function verifyDeleted(taskId) {
  return step('verify deletion', async () => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`);
    const body = await response.json();
    assert(response.status === 404, `expected 404, got ${response.status}`);
    assert(body.error === 'Task not found', `expected "Task not found", got "${body.error}"`);
  });
}

async function runSmokeTests() {
  await checkHealth();
  const created = await createTask();
  await listTasks(created.id);
  await getTask(created.id);
  await updateTask(created.id);
  await deleteTask(created.id);
  await verifyDeleted(created.id);

  console.log(`All ${passedCount} smoke test assertions passed.`);
  process.exit(0);
}

runSmokeTests().catch((error) => {
  console.error('Smoke tests FAILED');
  console.error(error.message);
  if (error.cause) {
    console.error('Cause:', error.cause.message);
  }
  process.exit(1);
});
