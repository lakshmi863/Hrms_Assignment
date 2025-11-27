const { Team, Employee, Log } = require('../db');

// Create a new team
exports.createTeam = async (req, res) => {
  const { name, description } = req.body;
  const { orgId, userId } = req.user;

  try {
    const team = await Team.create({
      name,
      description,
      organisationId: orgId,
    });
    
    await Log.create({
      organisationId: orgId,
      userId,
      action: 'team_created',
      meta: { teamId: team.id, name: team.name }
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team.', error: error.message });
  }
};

// Get all teams for the organisation
exports.listTeams = async (req, res) => {
  const { orgId } = req.user;

  try {
    const teams = await Team.findAll({
      where: { organisationId: orgId },
      include: Employee // Include the employees in each team
    });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams.', error: error.message });
  }
};

// Update a team
exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { orgId, userId } = req.user;

    try {
        const [updated] = await Team.update(req.body, { where: { id, organisationId: orgId } });
        if(updated) {
            await Log.create({
                organisationId: orgId,
                userId,
                action: 'team_updated',
                meta: { teamId: id, changes: req.body }
            });
            const updatedTeam = await Team.findOne({ where: { id } });
            return res.status(200).json(updatedTeam);
        }
        return res.status(404).json({ message: 'Team not found.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating team.', error: error.message });
    }
};


// Delete a team
exports.deleteTeam = async (req, res) => {
    const { id } = req.params;
    const { orgId, userId } = req.user;

    try {
        const deleted = await Team.destroy({ where: { id, organisationId: orgId } });
        if(deleted) {
            await Log.create({
                organisationId: orgId,
                userId,
                action: 'team_deleted',
                meta: { teamId: id }
            });
            return res.status(204).send();
        }
        return res.status(404).json({ message: 'Team not found.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team.', error: error.message });
    }
};

// Assign an employee to a team
exports.assignEmployeeToTeam = async (req, res) => {
    const { teamId } = req.params;
    const { employeeId } = req.body;
    const { orgId, userId } = req.user;

    try {
        // Security Check: ensure both team and employee belong to the same org
        const team = await Team.findOne({ where: { id: teamId, organisationId: orgId } });
        const employee = await Employee.findOne({ where: { id: employeeId, organisationId: orgId } });

        if (!team || !employee) {
            return res.status(404).json({ message: 'Team or Employee not found in your organisation.' });
        }

        await team.addEmployee(employee); // Sequelize association magic

        await Log.create({
            organisationId: orgId,
            userId,
            action: 'assigned_employee_to_team',
            meta: { employeeId, teamId }
        });

        res.status(200).json({ message: 'Employee assigned successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning employee.', error: error.message });
    }
};

// Un-assign an employee from a team
exports.unassignEmployeeFromTeam = async (req, res) => {
    const { teamId, employeeId } = req.params; // Assuming employeeId is in URL too
    const { orgId, userId } = req.user;

    try {
        const team = await Team.findOne({ where: { id: teamId, organisationId: orgId } });
        const employee = await Employee.findOne({ where: { id: employeeId, organisationId: orgId } });

        if (!team || !employee) {
            return res.status(404).json({ message: 'Team or Employee not found.' });
        }

        await team.removeEmployee(employee);

        await Log.create({
            organisationId: orgId,
            userId,
            action: 'unassigned_employee_from_team',
            meta: { employeeId, teamId }
        });
        
        res.status(200).json({ message: 'Employee unassigned successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error unassigning employee.', error: error.message });
    }
};