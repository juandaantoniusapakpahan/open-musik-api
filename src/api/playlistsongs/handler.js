class PlaylistSongsHandler {
  // eslint-disable-next-line max-len
  constructor(playlistSongsService, songsService, playlistsService, playlistActivitiesService, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._playlistsongsService = playlistSongsService;
    // eslint-disable-next-line no-underscore-dangle
    this._songsService = songsService;
    // eslint-disable-next-line no-underscore-dangle
    this._playlistsService = playlistsService;
    // eslint-disable-next-line no-underscore-dangle
    this._playlistActivitiesService = playlistActivitiesService;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postPlaylistSongsHandler(request, h) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.playlistSongValidate(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    // eslint-disable-next-line no-underscore-dangle
    await this._songsService.verifySongsById(songId);

    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsongsService.addPlaylistSongs(playlistId, songId);
    const action = 'add';
    // eslint-disable-next-line no-underscore-dangle, max-len
    await this._playlistActivitiesService.addPlaylistActivities(playlistId, songId, credentialId, action);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHander(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    // eslint-disable-next-line max-len, no-underscore-dangle
    const playlist = await this._playlistsongsService.getPlaylistSongsById(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongsHandler(request) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.playlistSongValidate(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsongsService.deletePlaylistSongsById(playlistId, songId);
    const action = 'delete';
    // eslint-disable-next-line no-underscore-dangle, max-len
    await this._playlistActivitiesService.addPlaylistActivities(playlistId, songId, credentialId, action);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
