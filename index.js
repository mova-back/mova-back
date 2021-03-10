require('dotenv').config();

const mongoose = require('mongoose');

const { Server } = require('./src/root/Server');
const appConfig = require('./src/config/AppConfig');

mongoose.connect(appConfig.mongooseConnectionURL, {
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
        appConfig.init();
      } catch (e) {
        return reject(e);
      }
      resolve();
    });
  }

  configInit()
    .then(() => {
      return new Server({
        port: Number(appConfig.port),
        host: appConfig.host,
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
      console.log(`Server listened at ${appConfig.host}:${appConfig.port}`);
      console.log('---------');
    });
});
