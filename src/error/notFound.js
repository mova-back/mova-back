const HttpError = require('./httpError');

class NotFound extends HttpError {
  constructor(message) {
    super();
    this.statusCode = 404;
    this.message = message;
  }
}

module.exports = NotFound;
