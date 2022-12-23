class PlaylistSongActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    // eslint-disable-next-line no-underscore-dangle
    this._playlistActivitiesService = playlistActivitiesService;
    // eslint-disable-next-line no-underscore-dangle
    this._playlistsService = playlistsService;
  }

  async getPlaylistsongsActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    // eslint-disable-next-line no-underscore-dangle
    const activities = await this._playlistActivitiesService.getPlaylistActivities(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
