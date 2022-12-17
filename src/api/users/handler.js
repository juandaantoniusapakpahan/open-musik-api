class UsersHandler {
  constructor(service, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._service = service;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validateUsersPayload(request.payload);

    // eslint-disable-next-line no-underscore-dangle
    const userId = await this._service.addUser(request.payload);
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    const user = await this._service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
