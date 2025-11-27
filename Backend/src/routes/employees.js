// backend/src/routes/employees.js

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// Protect all routes in this file with the authMiddleware
router.use(authMiddleware);

// @route   GET /api/employees
// @desc    Get all employees for the user's organisation
// @access  Private
router.get('/', listEmployees);

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private
router.post('/', createEmployee);

// @route   GET /api/employees/:id
// @desc    Get a single employee by their ID
// @access  Private
router.get('/:id', getEmployeeById);

// @route   PUT /api/employees/:id
// @desc    Update an employee's details
// @access  Private
router.put('/:id', updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private
router.delete('/:id', deleteEmployee);


module.exports = router;