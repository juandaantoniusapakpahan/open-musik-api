const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.likeDislikeAlbumHandler(request, h),
    options: {
      auth: 'apenmusikapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request) => handler.getLikeAlbumHandler(request),
  },
];

module.exports = routes;