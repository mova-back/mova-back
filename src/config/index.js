require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MODE: process.env.MODE,
  BASE_URL: process.env.BASE_URL,
  MDB_URL:
    'mongodb+srv://admin:G8G2Bfs5cBepEdr@cluster-mova-data-base.bnb39.mongodb.net/mova-data-base-user?retryWrites=true&w=majority',
  COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_HOST: 'smtp.ethereal.email',
  EMAIL_USERNAME: 'dean82@ethereal.email',
  EMAIL_PW: 'bRc47j8btyxNedz92Y',
  EMAIL_PORT: '587',
  REFRESH__EXP: '60d',
  CODE_EXP: '10m',
  ACCESS_EXP: '30m'
};
