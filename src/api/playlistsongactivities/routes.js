const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request) => handler.getPlaylistsongsActivitiesHandler(request),
    options: {
      auth: 'apenmusikapp_jwt',
    },
  },
];

module.exports = routes;
