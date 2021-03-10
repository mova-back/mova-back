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

const allowedOrigins = [
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

app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credential: true
  })
);

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
