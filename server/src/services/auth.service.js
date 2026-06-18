const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Sign a JWT for a given user id.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register a new user.
 * @param {Object} payload - { name, email, password }
 * @returns {{ token: string, user: Object }}
 */
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  return { token, user: user.toJSON() };
};

/**
 * Authenticate a user and return a JWT.
 * @param {Object} payload - { email, password }
 * @returns {{ token: string, user: Object }}
 */
const loginUser = async ({ email, password }) => {
  // Password field is select:false — explicitly include it
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user._id);
  return { token, user: user.toJSON() };
};

module.exports = { registerUser, loginUser };
