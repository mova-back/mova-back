require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MODE: process.env.MODE,
  MONGO_DB_CONNECTION_URL:
    'mongodb+srv://admin:G8G2Bfs5cBepEdr@cluster-mova-data-base.bnb39.mongodb.net/mova-data-base-user?retryWrites=true&w=majority',
  IN_PROD: process.env.MODE !== 'prod',
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY
};
