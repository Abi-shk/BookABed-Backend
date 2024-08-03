const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing and comparison.
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for creating and verifying JWT tokens.
const { JWT_SECRET, JWT_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = require('../config/config'); // Importing configuration variables.
const { findUserByEmail, addUser } = require('../models/userModel'); // Importing user model functions to interact with the database.
const { getAccessToken } = require('../middleware/amadeus'); // Importing a middleware function to get an access token from Amadeus API.

const generateAccessToken = (user) => {
  // Function to generate an access token for a user
  return jwt.sign({ email: user.email, firstName: user.firstName }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

const generateRefreshToken = (user) => {
  // Function to generate a refresh token for a user
  return jwt.sign({ email: user.email, firstName: user.firstName }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

const login = async (req, res) => {
  // Controller function to handle user login
  const { email, password } = req.body; // Extracting email and password from the request body
  const user = await findUserByEmail(email); // Finding the user by email
  if (user && await bcrypt.compare(password, user.password)) {
    // If user exists and password matches
    const accessToken = generateAccessToken(user); // Generate an access token
    const refreshToken = generateRefreshToken(user); // Generate a refresh token
    const apiToken = await getAccessToken(); // Get an access token from Amadeus API
    res.json({ success: true, accessToken, refreshToken, email: user.email, firstName: user.firstName, apiToken, userId: user._id }); // Send the tokens and user information as the response
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' }); // Send an error response if the email or password is incorrect
  }
};

const register = async (req, res) => {
  // Controller function to handle user registration
  const { email, password, firstName } = req.body; // Extracting email, password, and first name from the request body
  if (await findUserByEmail(email)) {
    // Check if the user already exists
    return res.status(400).json({ success: false, message: 'Email already exists' }); // Send an error response if the email already exists
  }
  const user = await addUser(email, password, firstName); // Add the new user to the database
  res.status(201).json({ success: true, user }); // Send a success response with the user information
};

const refresh = (req, res) => {
  // Controller function to handle token refresh
  const { refreshToken } = req.body; // Extracting the refresh token from the request body
  if (!refreshToken) return res.sendStatus(401); // Send an unauthorized status if no refresh token is provided

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    // Verify the refresh token
    if (err) return res.sendStatus(403); // Send a forbidden status if the token is invalid

    const newAccessToken = generateAccessToken({ email: user.email, firstName: user.firstName }); // Generate a new access token
    res.json({ success: true, accessToken: newAccessToken }); // Send the new access token as the response
  });
};

module.exports = { login, register, refresh }; // Exporting the controller functions for use in other parts of the application
