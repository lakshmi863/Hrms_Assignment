// backend/src/db.js

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// 1. Initialize Sequelize with database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    // ADD THIS SECTION FOR RENDER DEPLOYMENT
    dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Render's self-signed certs
        }
    } : {}
   
  }
);

// 2. Create a db object to hold everything
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 3. Load all model definitions and attach them to the db object
// This is the part that was missing from your previous file.
db.Organisation = require('./models/organisation.js')(sequelize, DataTypes);
db.User = require('./models/user.js')(sequelize, DataTypes);
db.Employee = require('./models/employee.js')(sequelize, DataTypes);
db.Team = require('./models/team.js')(sequelize, DataTypes);
db.EmployeeTeam = require('./models/employeeTeam.js')(sequelize, DataTypes);
db.Log = require('./models/log.js')(sequelize, DataTypes);

// 4. Define all model associations
// This step is also crucial for the models to work together.
db.Organisation.hasMany(db.User, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
db.Organisation.hasMany(db.Employee, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
db.Organisation.hasMany(db.Team, { foreignKey: 'organisationId', onDelete: 'CASCADE' });
db.Organisation.hasMany(db.Log, { foreignKey: 'organisationId', onDelete: 'CASCADE' });

db.User.belongsTo(db.Organisation, { foreignKey: 'organisationId' });
db.User.hasMany(db.Log, { foreignKey: 'userId' });

db.Employee.belongsTo(db.Organisation, { foreignKey: 'organisationId' });

db.Team.belongsTo(db.Organisation, { foreignKey: 'organisationId' });

db.Employee.belongsToMany(db.Team, { through: db.EmployeeTeam, foreignKey: 'employeeId' });
db.Team.belongsToMany(db.Employee, { through: db.EmployeeTeam, foreignKey: 'teamId' });

db.Log.belongsTo(db.Organisation, { foreignKey: 'organisationId' });
db.Log.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// 5. Export the fully configured db object
module.exports = db;