module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organisationId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSONB, // Use JSONB for PostgreSQL
    },
  }, {
    tableName: 'logs',
    timestamps: true,
    createdAt: 'timestamp',
    updatedAt: false,
  });

  return Log;
};