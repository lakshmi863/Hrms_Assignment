const { Employee, Log, Team } = require('../db');

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const { orgId, userId } = req.user; // From auth middleware

  try {
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      organisationId: orgId, // Ensure employee is tied to the correct organisation
    });

    // Log this action
    await Log.create({
      organisationId: orgId,
      userId,
      action: 'employee_created',
      meta: { employeeId: employee.id, name: `${firstName} ${lastName}` }
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee.', error: error.message });
  }
};

// Get all employees for the logged-in user's organisation
exports.listEmployees = async (req, res) => {
  const { orgId } = req.user;

  try {
    const employees = await Employee.findAll({
      where: { organisationId: orgId },
      include: { // Include the teams they belong to
        model: Team,
        through: { attributes: [] } // Don't include the join table's attributes
      },
      order: [['lastName', 'ASC']],
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees.', error: error.message });
  }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  const { orgId } = req.user;

  try {
    const employee = await Employee.findOne({
      where: { id, organisationId: orgId }, // CRITICAL: Security check
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee.', error: error.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { orgId, userId } = req.user;
  
  try {
    const [updated] = await Employee.update(req.body, {
      where: { id, organisationId: orgId }, // CRITICAL: Security check
    });

    if (updated) {
      // Log the action
      await Log.create({
        organisationId: orgId,
        userId,
        action: 'employee_updated',
        meta: { employeeId: id, changes: req.body }
      });
      const updatedEmployee = await Employee.findOne({ where: { id } });
      return res.status(200).json(updatedEmployee);
    }
    return res.status(404).json({ message: 'Employee not found.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee.', error: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const { orgId, userId } = req.user;

  try {
    const deleted = await Employee.destroy({
      where: { id, organisationId: orgId }, // CRITICAL: Security check
    });

    if (deleted) {
      // Log the action
      await Log.create({
        organisationId: orgId,
        userId,
        action: 'employee_deleted',
        meta: { employeeId: id }
      });
      return res.status(204).send(); // 204 No Content
    }
    return res.status(404).json({ message: 'Employee not found.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee.', error: error.message });
  }
};