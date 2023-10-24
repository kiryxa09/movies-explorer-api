const httpConstants = require('http2').constants;

class StatusConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_CONFLICT;
  }
}

module.exports = StatusConflictError;
