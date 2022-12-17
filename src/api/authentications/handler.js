class AuthenticationsHanlder {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._authenticationsService = authenticationsService;
    // eslint-disable-next-line no-underscore-dangle
    this._usersService = usersService;
    // eslint-disable-next-line no-underscore-dangle
    this._tokenManager = tokenManager;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validatorPostAuthenticationPayload(request.payload);
    const { username, password } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    const id = await this._usersService.verifyUserCredential(username, password);
    // eslint-disable-next-line no-underscore-dangle
    const accessToken = this._tokenManager.generateAccessToken({ id });
    // eslint-disable-next-line no-underscore-dangle
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    // eslint-disable-next-line no-underscore-dangle
    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validatorPutAuthentication(request.payload);
    const { refreshToken } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    // eslint-disable-next-line no-underscore-dangle
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    // eslint-disable-next-line no-underscore-dangle
    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validatorDeleteAuthentication(request.payload);
    const { refreshToken } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    // eslint-disable-next-line no-underscore-dangle
    await this._authenticationsService.deleteRefreshToken(refreshToken);
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHanlder;
