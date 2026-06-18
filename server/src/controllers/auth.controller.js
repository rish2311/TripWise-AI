const { registerUser, loginUser } = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await registerUser({ name, email, password });

  res.status(201).json({
    status: 'success',
    data: { token, user },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser({ email, password });

  res.status(200).json({
    status: 'success',
    data: { token, user },
  });
});

/**
 * GET /api/auth/me  [Protected]
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user.toJSON() },
  });
});

module.exports = { register, login, getMe };
