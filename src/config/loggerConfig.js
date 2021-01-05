const { format, transports } = require('winston');
const path = require('path');

const infoPath = path.join(__dirname, '../../logs/logs-common.log');
const errorsPath = path.join(__dirname, '../../logs/logs-errors.log');

const configConsole = {
  format: format.combine(format.colorize(), format.cli()),
  transports: [new transports.Console()]
};

const configFile = {
  format: format.json(),
  transports: [
    new transports.File({
      level: 'info',
      filename: infoPath
    }),
    new transports.File({
      level: 'error',
      filename: errorsPath
    })
  ]
};

module.exports = { configConsole, configFile };
