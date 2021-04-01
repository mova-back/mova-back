require('dotenv').config();

const mongoose = require('mongoose');

const chalk = require('chalk');
const stdout = require('stdout-stream');
const { Server } = require('./src/root');
const config = require('./src/config/AppConfig');
const controllers = require('./src/controllers');
const middlewares = require('./src/middlewares');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const logger = require('./logger');

mongoose.connect(config.mongooseConnectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const connectToDB = mongoose.connection;

connectToDB.on('open', () => {
  logger.debug('Database initialized...');
});

connectToDB.on('error', (error) => {
  chalk.blue(error.stack);
  logger.error('Database fails to initialize...', error);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

connectToDB.on('connected', () => {
  function configInit() {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      try {
        config.init();
      } catch (e) {
        return reject(e);
      }
      resolve();
    });
  }

  configInit()
    .then(() => {
      return new Server({
        port: Number(config.port),
        host: config.host,
        controllers,
        middlewares,
        errorMiddleware,
        cookieSecret: config.cookieSecret,
        logger,
      });
    })
    .then((params) => {
      logger.info('Server initialized...', params);
      logger.debug('--- APP CONFIG ---');
      logger.debug(`HOST: ${config.host}`);
      logger.debug(`PORT: ${config.port}`);
      logger.debug(`NAME: ${config.name}`);
    })
    .catch((error) => {
      stdout.write(chalk.blue(error.stack));
      logger.error('Server fails to initialize...', error);
    })
    .then(() => {
      logger.debug('---------');
      logger.debug(`Server listened at ${config.host}:${config.port}`);
      logger.debug('---------');
    });
});
