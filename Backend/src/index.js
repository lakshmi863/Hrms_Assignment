require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express');
const cors = require('cors'); // Enables Cross-Origin Resource Sharing

// 2. IMPORT LOCAL MODULES
const db = require('./db'); // Imports the database setup from models/index.js
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logRoutes = require('./routes/logs');
const errorHandler = require('./middlewares/errorHandler'); // Optional error handler

// 3. INITIALIZE EXPRESS APP
const app = express();
const PORT = process.env.PORT || 5000;

// 4. CONFIGURE MIDDLEWARE
app.use(cors()); // Allow requests from different origins (e.g., your React frontend)
app.use(express.json()); // Body parser for JSON requests

// 5. DEFINE A BASIC WELCOME ROUTE
app.get('/', (req, res) => {
  res.send('Welcome to the HRMS API!');
});

// 6. SETUP API ROUTES
// Mount the routers on their specific base paths
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);


// 7. SETUP GLOBAL ERROR HANDLER
// This middleware should be the last one in the chain
app.use(errorHandler);

// 8. CONNECT TO DATABASE AND START SERVER
// We use `db.sequelize.sync()` to ensure our database tables are created based on our models.
// The `{ force: false }` option prevents it from dropping tables on every restart.
// For development, you might sometimes use `{ force: true }` to reset the database.
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected and tables synced successfully.');

    // Start the Express server only after the database is ready
    app.listen(PORT, () => {
      console.log(`Backend server is running and listening on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });