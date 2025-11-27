module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define('Organisation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    tableName: 'organisations',
    timestamps: true,
    createdAt: 'created_at', // Map createdAt to a snake_case column
    updatedAt: false, // Disable updatedAt if you don't need it
  });

  return Organisation;
};