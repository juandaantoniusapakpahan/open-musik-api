const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postPlaylistSongsHandler(request, h),
    options: {
      auth: 'apenmusikapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.getPlaylistSongsHander(request),
    options: {
      auth: 'apenmusikapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.deletePlaylistSongsHandler(request),
    options: {
      auth: 'apenmusikapp_jwt',
    },
  },
];

module.exports = routes;
