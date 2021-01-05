const HttpError = require('./httpError');

class BadRequest extends HttpError {
  constructor(message) {
    super();
    this.statusCode = 400;
    this.message = message;
  }
}

module.exports = BadRequest;
