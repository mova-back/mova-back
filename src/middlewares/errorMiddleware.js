const HttpError = require('../error/httpError');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    const httpError = err;

    res.status(httpError.statusCode).json({
      statusCode: httpError.statusCode,
      message: httpError.message
    });

    next(err);
    return;
  }

  res.status(500).json({
    statusCode: 500,
    message: err.message
  });

  next(err);
};

const catchErrors = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (err) {
    return next(err);
  }
};

const handleErrorLogger = (err) => {
  if (err instanceof HttpError) {
    return err;
  }

  return { statusCode: 500, message: err.message };
};

module.exports = {
  errorMiddleware,
  catchErrors,
  handleErrorLogger
};
