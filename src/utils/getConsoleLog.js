const { createLogger } = require('winston');
const { configConsole } = require('../config/loggerConfig');

const winstonConsole = createLogger(configConsole);

module.exports = (str, errStr) => {
  winstonConsole.log('info', str);
  if (errStr) {
    winstonConsole.log('error', errStr);
  }
};
