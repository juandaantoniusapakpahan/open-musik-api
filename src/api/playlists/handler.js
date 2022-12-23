class PlaylistsHandler {
  constructor(playlistsService, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._playlistsService = playlistsService;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      this._validator.playlistsPayloadValidate(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      // eslint-disable-next-line no-underscore-dangle
      const playlistId = await this._playlistsService.addPlaylists({ name, owner: credentialId });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    // eslint-disable-next-line no-underscore-dangle
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.deletePlaylists(playlistId);

    return {
      status: 'success',
      message: 'Playlists berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
