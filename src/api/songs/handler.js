// const ClientError = require('../../exeptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._service = service;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validateSongPayload(request.payload);
    // eslint-disable-next-line no-underscore-dangle
    const songId = await this._service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    // eslint-disable-next-line no-underscore-dangle
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    await this._service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    // eslint-disable-next-line no-underscore-dangle
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
