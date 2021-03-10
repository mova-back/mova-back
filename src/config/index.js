require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MODE: process.env.MODE,
  BASE_URL: process.env.BASE_URL,
  COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET,
  JWT_ISS: process.env.JWT_ISS,
  TOKEN_ACCESS_EXP: process.env.TOKEN_ACCESS_EXP,
  TOKEN_ACCESS_SECRET: process.env.TOKEN_ACCESS_SECRET,
  TOKEN_REFRESH_EXP: process.env.TOKEN_REFRESH_EXP,
  TOKEN_REFRESH_SECRET: process.env.TOKEN_REFRESH_SECRET,
  MAX_REFRESH_SESSIONS_COUNT: process.env.MAX_REFRESH_SESSIONS_COUNT,
  TOKEN_RESET_PASSWORD_EXP: process.env.TOKEN_RESET_PASSWORD_EXP,
  TOKEN_RESET_PASSWORD_SECRET: process.env.TOKEN_RESET_PASSWORD_SECRET,
  TOKEN_EMAIL_CONFIRM_EXP: process.env.TOKEN_EMAIL_CONFIRM_EXP,
  EMAIL_HOST: 'smtp.ethereal.email',
  EMAIL_USERNAME: 'dean82@ethereal.email',
  EMAIL_PW: 'bRc47j8btyxNedz92Y',
  EMAIL_PORT: '587',
  CODE_EXP: '10m',
  TOKEN_EMAIL_CONFIRM_SECRET: process.env.TOKEN_EMAIL_CONFIRM_SECRET,
  MDB_URL: 'mongodb+srv://admin:G8G2Bfs5cBepEdr@cluster-mova-data-base.bnb39.mongodb.net/mova-data-base-user?retryWrites=true&w=majority',
};
