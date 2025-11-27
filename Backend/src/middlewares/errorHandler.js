const errorHandler = (err, req, res, next) => {
  // Log the error to the console for debugging during development
  console.error(err.stack);

  // Set a default status code if one isn't already set
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Include the stack trace only in development mode for security reasons
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;