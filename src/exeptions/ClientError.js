class ClientError extends Error {
  // eslint-disable-next-line constructor-super
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
