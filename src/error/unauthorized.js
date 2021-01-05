const HttpError = require('./httpError');

class Unauthorized extends HttpError {
  constructor(message) {
    super();
    this.statusCode = 401;
    this.message = message;
  }
}

module.exports = Unauthorized;
