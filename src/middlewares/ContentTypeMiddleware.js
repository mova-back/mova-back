const { BaseMiddleware } = require('../root/BaseMiddleware');
const { AppError } = require('../root/AppError');
const { errorCodes } = require('../error/errorCodes');

class ContentTypeMiddleware extends BaseMiddleware {
  async init() {
    // TODO
    console.log(`${this.constructor.name} initialized...`);
  }

  handler() {
    return async (req, res, next) => {
      try {
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
          const contentType = req.headers['Content-Type'] || req.headers['content-type'];
          if (!contentType) {
            throw new AppError({ ...errorCodes.BAD_REQUEST, message: 'Please provide content-type' });
          }

          const validContentType = ['application/json', 'multipart/form-data'];
          const isValidContentType = contentType.includes('application/json') || contentType.includes('multipart/form-data');

          if (!isValidContentType) {
            throw new AppError({ ...errorCodes.BAD_REQUEST, message: `Invalid content type. Expect one of: [${validContentType}]` });
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = { ContentTypeMiddleware };
