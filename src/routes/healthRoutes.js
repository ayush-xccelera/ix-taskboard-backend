const express = require('express');

const router = express.Router();

/**
 * GET /api/health -> liveness probe, always 200 when the process is up.
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
