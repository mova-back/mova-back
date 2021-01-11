require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MODE: process.env.MODE,
  BASE_URL: process.env.BASE_URL,
  MDB_URL:
    'mongodb+srv://admin:G8G2Bfs5cBepEdr@cluster-mova-data-base.bnb39.mongodb.net/mova-data-base-user?retryWrites=true&w=majority',
  COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET,
  JWT_SECRET: 1234567890,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PW: process.env.EMAIL_PW,
  EMAIL_PORT: process.env.EMAIL_PORT,
  REFRESH__EXP: process.env.REFRESH__EXP,
  CODE_EXP: process.env.CODE_EXP,
  ACCESS_EXP: process.env.ACCESS_EXP
};
