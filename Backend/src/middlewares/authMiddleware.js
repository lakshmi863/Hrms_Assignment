const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
  // 1. Get the token from the request header
  const authHeader = req.headers.authorization;

  // 2. Check if the token exists and is in the correct format ('Bearer <token>')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  // Extract the token from the header string
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using the secret key from your .env file
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the payload to the request object
    // This makes `userId` and `orgId` available in all subsequent controllers
    req.user = { 
      userId: decodedPayload.userId, 
      orgId: decodedPayload.orgId 
    };

    // 5. If verification is successful, pass control to the next middleware or controller
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Forbidden: Token has expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Forbidden: Invalid token.' });
    }
    
    // For other unexpected errors
    return res.status(500).json({ message: 'Internal server error during authentication.'});
  }
};