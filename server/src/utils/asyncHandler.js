/**
 * Wraps async route handlers to automatically catch errors
 * and pass them to Express error middleware — avoids try/catch boilerplate.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
