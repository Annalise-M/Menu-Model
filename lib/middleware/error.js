const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  // Log error with full stack trace
  logger.error({
    message: err.message,
    stack: err.stack,
    status,
    path: req.path,
    method: req.method
  });

  res.status(status);

  res.send({
    status,
    message: err.message
  });
};
