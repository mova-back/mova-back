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

const whitelist = [
  'http://localhost:3000',
  'http://0.0.0.0:3000',
  'http://localhost:4400',
  'http://0.0.0.0:4400',
  'https://mova-front.netlify.app/',
  'https://movafront.netlify.app/',
  'https://mova-gh.netlify.app/',
  'http://localhost:5000',
  'http://0.0.0.0:5000',
  'http://127.0.0.1:5000/'
];


var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credential: true
}
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
