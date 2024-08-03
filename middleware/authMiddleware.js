const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for handling JWTs
const { JWT_SECRET } = require('../config/config'); // Import the JWT secret key from the configuration file

// Middleware function to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization; // Get the token from the Authorization header

  if (token) {
    // If a token is present, verify it using the jwt.verify method
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        // If there is an error (e.g., token is invalid or expired), send a 403 Forbidden status
        return res.sendStatus(403);
      }
      // If the token is valid, attach the user information to the request object
      req.user = user;
      next(); // Call the next middleware function in the stack
    });
  } else {
    // If no token is present, send a 401 Unauthorized status
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT }; // Export the authenticateJWT function for use in other parts of the application
