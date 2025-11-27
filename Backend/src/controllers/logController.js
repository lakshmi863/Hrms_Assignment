// backend/src/controllers/logController.js

const { Log, User } = require('../db'); // <-- Make sure this points to '../db'

// Get all logs for the organisation
exports.getLogs = async (req, res, next) => {
  const { orgId } = req.user;

  try {
    const logs = await Log.findAll({
      where: { organisationId: orgId },
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'], // Only include non-sensitive user info
      },
      order: [['timestamp', 'DESC']], // Show newest logs first
    });
    res.status(200).json(logs);
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
};