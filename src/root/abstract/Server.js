const express = require('express');
const path = require('path');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');

const { Assert: assert } = require('./Assert');
const { BaseMiddleware } = require('./BaseMiddleware');
// const { AbstractLogger } = require('./AbstractLogger');

class Server {
  constructor({ port, host, controllers, middlewares, errorMiddleware, cookieSecret, reqLimit = '5mb' }) {
    assert.integer(port, { required: true, min: 1000 });
    assert.string(host, { required: true, notEmpty: true });
    assert.array(controllers, { required: true, notEmpty: true, message: 'controllers param expects not empty array' });
    assert.array(middlewares, { required: true, notEmpty: true, message: 'middlewares param expects not empty array' });
    assert.instanceOf(errorMiddleware.prototype, BaseMiddleware);
    assert.string(cookieSecret);
    assert.string(reqLimit);
    // assert.instanceOf(logger, AbstractLogger);

    // Todo ; change to logger
    console.log('Server start initialization...');
    return start({ port, host, controllers, middlewares, ErrorMiddleware: errorMiddleware, cookieSecret, reqLimit });
  }
}

function start({ port, host, controllers, middlewares, ErrorMiddleware, cookieSecret, reqLimit }) {
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
      middlewares
        .map((Middleware) => new Middleware())
        .forEach((middleware) => {
          middleware.init();
          app.use(middleware.handler());
        });
    } catch (e) {
      return reject(e);
    }

    /**
     * controllers parser
     */
    try {
      controllers
        .map((Controller) => new Controller())
        .forEach((controller) => {
          controller.init();
          app.use(controller.router);
        });
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
      // Todo change 2 logger
      console.log('unhandledRejection', reason);
    });

    process.on('rejectionHandled', (promise) => {
      console.log('rejectionHandled', promise);
    });

    process.on('multipleResolves', (type, promise, reason) => {
      console.log('multipleResolves', { type, promise, reason });
    });

    process.on('uncaughtException', (error) => {
      console.log('uncaughtException', error);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });

    return app.listen(port);
  });
}

module.exports = { Server };
