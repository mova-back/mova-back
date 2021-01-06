const mongoose = require('mongoose');

const { PORT, MONGO_DB_CONNECTION_URL } = require('./config');
const { processErrorLogger } = require('./middlewares/loggerMiddleware');
const getConsoleLog = require('./utils/getConsoleLog');

const app = require('./app');

process
  .on('unhandledRejection', (err) => {
    processErrorLogger(err.message, 'Unhandled Rejection');
  })
  .on('uncaughtException', (err) => {
    const logger = processErrorLogger(err.message, 'Uncaught Exception');
    const { exit } = process;
    logger.on('finish', () => exit(1));
  });

const connectDb = () => {
  const db = mongoose.connection;
  db.on('error', (err) => {
    getConsoleLog('err', err);
  });
  db.once('connected', () => {
    getConsoleLog('mongoose is connected');
  });
  return mongoose.connect(MONGO_DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

try {
  connectDb().then(() => {
    app.listen(PORT, () => {
      getConsoleLog(`app is listening to PORT ${PORT}`);
    });
  });
} catch (err) {
  getConsoleLog('err', err.message);
}
