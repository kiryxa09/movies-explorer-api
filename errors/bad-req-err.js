const httpConstants = require('http2').constants;

class BadReqError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadReqError;
