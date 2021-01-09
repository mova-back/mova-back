const express = require('express');
const YAML = require('yamljs');
const path = require('path');

const swaggerUI = require('swagger-ui-express');

const { errorLoggerMiddleware } = require('./middlewares/loggerMiddleware');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const userRouter = require('./resources/user/user.router');
const profileRouter = require('./resources/profile/profile.router');
const wordRouter = require('./resources/word/word.router');

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());
// app.use((req, res, next) => {
//   res.locals.env = process.env;
//   next();
// });
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/api/test', (req, res, next) => {
  if (req.method === 'GET') {
    res.status(200).json({ message: "It's Alive!" });
    return;
  }
  next();
});

app.use('/api', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/word', wordRouter);
app.use(errorMiddleware);
app.use(errorLoggerMiddleware);

module.exports = app;
