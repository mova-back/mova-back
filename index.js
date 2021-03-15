require('dotenv').config();

const mongoose = require('mongoose');

const { Server } = require('./src/root');
const config = require('./src/config/AppConfig');
const controllers = require('./src/controllers');
const middlewares = require('./src/middlewares');

mongoose.connect(config.mongooseConnectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connectToDB = mongoose.connection;

connectToDB.on('open', () => {
  console.log('Database initialized...');
});

connectToDB.on('error', (error) => {
  console.log('Database fails to initialize...', error);
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
      });
    })
    .then((params) => {
      console.log('Server initialized ...', params);
    })
    .catch((error) => {
      console.log('Server fails to initialize...', error);
    })
    .then(() => {
      console.log('---------');
      console.log(`Server listened at ${config.host}:${config.port}`);
      console.log('---------');
    });
});
