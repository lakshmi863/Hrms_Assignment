const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log, sequelize } = require('../db');

// Handles new organisation and admin user creation
exports.register = async (req, res) => {
  const { orgName, adminName, email, password } = req.body;

  // Basic validation
  if (!orgName || !adminName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Create the organisation
    const organisation = await Organisation.create({ name: orgName }, { transaction });

    // 2. Hash the admin's password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create the admin user linked to the new organisation
    const user = await User.create({
      name: adminName,
      email,
      passwordHash,
      organisationId: organisation.id,
    }, { transaction });

    // Log the creation event
    await Log.create({
        organisationId: organisation.id,
        userId: user.id,
        action: 'organisation_created',
        meta: { orgName: organisation.name }
    }, { transaction });

    // If everything is successful, commit the transaction
    await transaction.commit();

    // 4. Generate a JWT for the new user
    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      message: 'Organisation and admin user created successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    // If any step fails, roll back the transaction
    await transaction.rollback();
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

// Handles user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find the user by their email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, orgId: user.organisationId },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log the login event
    await Log.create({
        organisationId: user.organisationId,
        userId: user.id,
        action: 'user_logged_in',
    });

    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};