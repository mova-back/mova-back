const HttpError = require('./httpError');
const BadRequest = require('./badRequest');
const NotFound = require('./notFound');
const Unauthorized = require('./unauthorized');
const UnprocessableEntity = require('./unprocessableEntity');

module.exports = { HttpError, BadRequest, NotFound, Unauthorized, UnprocessableEntity };
