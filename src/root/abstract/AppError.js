class AppError extends Error {
  constructor(options) {
    super();
    this.message = options.message || this.description; // message thrown by error
    this.status = options.status || 500;
    this.code = options.code || 'UNEXPECTED_ERROR';
    this.layer = options.layer || undefined;
    this.req = options.req || undefined;
    this.origin = options.origin || undefined; // origin error data
  }
}

module.exports = { AppError };
