const ErrorResponse = require('./ErrorResponse');
const { BaseMiddleware } = require('../../root');
const { errorCodes } = require('../../error/errorCodes');
const logger = require('../../../logger');

const notImportantCodes = [400, 401, 403, 404, 422];

class ProdErrorMiddleware extends BaseMiddleware {
  async init() {
    logger.debug(`${this.constructor.name} initialized...`);
  }

  handler() {
    // eslint-disable-next-line no-unused-vars
    return (error, req, res, next) => {
      if (error.status === 404) {
        const errorRes = new ErrorResponse({
          ...error,
          src: `${process.env.NODE_ENV}:err:middleware`,
        });

        res.status(errorRes.status).json(errorRes);
      } else {
        const errorRes = new ErrorResponse({
          ...error,
          message: error.message || error,
          code: error.code || errorCodes.SERVER.code,
          status: error.status || errorCodes.SERVER.status,
          src: `${process.env.NODE_ENV}:err:middleware`,
        });

        // log only significant errors
        if (!notImportantCodes.includes(error.status)) {
          logger.error(errorRes.message, error);
        }
        delete errorRes.stack;
        res.status(errorRes.status).json(errorRes);
      }
    };
  }
}

module.exports = { ProdErrorMiddleware };
