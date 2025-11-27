// backend/src/routes/logs.js

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getLogs } = require('../controllers/logController');

// All routes in this file are protected by the authentication middleware.
router.use(authMiddleware);

// @route   GET /api/logs
// @desc    Get all audit logs for the user's organisation.
// @access  Private (requires token)
router.get('/', getLogs);

module.exports = router;