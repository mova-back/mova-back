const express = require('express');
const path = require('path');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');

const { Assert: assert } = require('./Assert');
const { BaseMiddleware } = require('./BaseMiddleware');
const { AbstractLogger } = require('./AbstractLogger');
const logger = require('../../../logger');

class Server {
  constructor({ port, host, controllers, middlewares, errorMiddleware, cookieSecret, reqLimit = '5mb', logger }) {
    assert.integer(port, { required: true, min: 1000 });
    assert.string(host, { required: true, notEmpty: true });
    assert.array(controllers, { required: true, notEmpty: true, message: 'controllers param expects not empty array' });
    assert.array(middlewares, { required: true, notEmpty: true, message: 'middlewares param expects not empty array' });
    assert.instanceOf(errorMiddleware.prototype, BaseMiddleware);
    assert.string(cookieSecret);
    assert.string(reqLimit);
    assert.instanceOf(logger, AbstractLogger);

    logger.info('Server start initialization...');
    return start({ port, host, controllers, middlewares, ErrorMiddleware: errorMiddleware, cookieSecret, reqLimit, logger });
  }
}

function start({ port, controllers, middlewares, ErrorMiddleware, cookieSecret, reqLimit, lo }) {
  return new Promise((resolve, reject) => {
    const app = express();

    if (process.env.NODE_ENV !== 'production') app.use(morganLogger('dev'));
    app.use(express.json({ limit: reqLimit }));
    app.use(express.urlencoded({ extended: false, limit: reqLimit }));
    app.use(cookieParser(cookieSecret));
    app.use(express.static(path.join(__dirname, 'public')));

    /**
     * middlewares parser
     */

    try {
      for (const middleware of middlewares.map((Middleware) => new Middleware({ logger }))) {
        middleware.init();
        app.use(middleware.handler());
      }
    } catch (e) {
      return reject(e);
    }

    /**
     * controllers parser
     */
    try {
      for (const controller of controllers.map((Controller) => new Controller({ logger }))) {
        controller.init();
        app.use(controller.router);
      }
    } catch (e) {
      reject(e);
    }

    /**
     * error handler
     */
    try {
      const middleware = new ErrorMiddleware();
      // await
      middleware.init();
      app.use(middleware.handler());
    } catch (e) {
      return reject(e);
    }

    app.use((req, res) => {
      res.status(404).json({
        message: `Route: '${req.url}' not found`,
        code: 'ROUTE_NOT_FOUND_ERROR',
      });
    });

    // eslint-disable-next-line no-unused-vars
    process.on('unhandledRejection', (reason, promise) => {
      console.log(reason);
      logger.error('unhandledRejection', reason);
    });

    process.on('rejectionHandled', (promise) => {
      logger.warn('rejectionHandled', promise);
    });

    process.on('multipleResolves', (type, promise, reason) => {
      logger.error('multipleResolves', { type, promise, reason });
    });

    process.on('uncaughtException', (error) => {
      logger.fatal('uncaughtException', error);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });

    return app.listen(port || 4400, () => resolve({ port }));
  });
}

module.exports = { Server };
