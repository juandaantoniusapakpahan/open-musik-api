const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (request, h) => handler.postExportNotesHandler(request, h),
    options: {
      auth: 'apenmusikapp_jwt',
    },
  },
];

module.exports = routes;


