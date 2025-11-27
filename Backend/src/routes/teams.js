// backend/src/routes/teams.js

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam,
} = require('../controllers/teamController');

// Protect all routes
router.use(authMiddleware);

// === CRUD for Teams ===

// @route   GET /api/teams
// @desc    Get all teams for the user's organisation
// @access  Private
router.get('/', listTeams);

// @route   POST /api/teams
// @desc    Create a new team
// @access  Private
router.post('/', createTeam);

// @route   PUT /api/teams/:id
// @desc    Update a team's details
// @access  Private
router.put('/:id', updateTeam);

// @route   DELETE /api/teams/:id
// @desc    Delete a team
// @access  Private
router.delete('/:id', deleteTeam);

// === Employee Assignment Routes ===

// @route   POST /api/teams/:teamId/assign
// @desc    Assign an employee to a specific team
// @access  Private
router.post('/:teamId/assign', assignEmployeeToTeam);

// @route   DELETE /api/teams/:teamId/unassign/:employeeId
// @desc    Unassign an employee from a specific team
// @access  Private
router.delete('/:teamId/unassign/:employeeId', unassignEmployeeFromTeam);

module.exports = router;