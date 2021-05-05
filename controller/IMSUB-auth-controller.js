const User = require('../models/IMSUB-User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc         login
 * @route        POST	/api/v1/auth/login
 * @access       Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email or passord', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // Chekc if the password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

/**
 * @desc         register
 * @route        POST /api/v1/auth/register
 * @access       Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});