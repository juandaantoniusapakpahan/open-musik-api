const UserAlbumLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const userAlbumLikes = new UserAlbumLikeHandler(service);
    server.route(routes(userAlbumLikes));
  },
};