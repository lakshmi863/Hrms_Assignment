module.exports = (sequelize, DataTypes) => {
  const EmployeeTeam = sequelize.define('EmployeeTeam', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employees',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    teamId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'teams',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'employee_teams',
    timestamps: true,
    createdAt: 'assigned_at',
    updatedAt: false,
  });

  return EmployeeTeam;
};