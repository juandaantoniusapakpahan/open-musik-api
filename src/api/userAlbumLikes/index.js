const UserAlbumLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { userAlbumLikeService, cacheService }) => {
    const userAlbumLikes = new UserAlbumLikeHandler(userAlbumLikeService, cacheService);
    server.route(routes(userAlbumLikes));
  },
};