const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = require('../config/config');
const { findUserByEmail, addUser } = require('../models/userModel');
const { getAccessToken } = require('../middleware/amadeus');

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email, firstName: user.firstName }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email, firstName: user.firstName }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const apiToken= await getAccessToken()
    res.json({ success: true, accessToken, refreshToken, email: user.email, firstName: user.firstName ,apiToken, userId:user._id});
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
};

const register = async (req, res) => {
  const { email, password, firstName } = req.body;
  if (await findUserByEmail(email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  const user = await addUser(email, password, firstName);
  res.status(201).json({ success: true, user });
};

const refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken({ email: user.email, firstName: user.firstName });
    res.json({ success: true, accessToken: newAccessToken });
  });
};

module.exports = { login, register, refresh };
