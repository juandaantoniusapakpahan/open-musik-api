// const ClientError = require('../../exeptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._service = service;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postAlbumsHandler(request, h) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
