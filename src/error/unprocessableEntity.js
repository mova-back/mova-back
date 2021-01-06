const HttpError = require('./httpError');

class UnprocessableEntity extends HttpError {
  constructor(message) {
    super();
    this.statusCode = 422;
    this.message = message;
  }
}

module.exports = UnprocessableEntity;
