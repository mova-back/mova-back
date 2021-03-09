const express = require('express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const { COOKIE_SESSION_SECRET } = require('./config');

const { errorLoggerMiddleware } = require('./middlewares/loggerMiddleware');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const userRouter = require('./resources/user/user.router');
const profileRouter = require('./resources/profile/profile.router');
const wordRouter = require('./resources/word/word.router');

const app = express();
app.use(cookieParser(COOKIE_SESSION_SECRET));

const corsOptions = {
  origin:  ['http://localhost:3000/', 'https://mova-gh.netlify.app/'],
  credential: true
};
app.use(cors(corsOptions));

const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/api', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/dictionary', wordRouter);
app.use(errorMiddleware);
app.use(errorLoggerMiddleware);

module.exports = app;
