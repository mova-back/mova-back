const { config } = require('dotenv');

const { parsed } = config();

const { PORT, MODE, IN_PROD = MODE !== 'prod', SECRET_JWT_KEY } = parsed;

module.exports = {
  PORT,
  MODE,
  MONGO_DB_CONNECTION_URL:
    'mongodb+srv://admin:G8G2Bfs5cBepEdr@cluster-mova-data-base.bnb39.mongodb.net/mova-data-base-user?retryWrites=true&w=majority',
  IN_PROD,
  SECRET_JWT_KEY
};
