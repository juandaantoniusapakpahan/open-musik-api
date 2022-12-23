const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongactivities',
  vesions: '1.0.0',
  register: async (server, { playlistActivitiesService, playlistsService }) => {
    // eslint-disable-next-line max-len
    const handlerPlaylistsongActivities = new PlaylistSongActivitiesHandler(playlistActivitiesService, playlistsService);
    server.route(routes(handlerPlaylistsongActivities));
  },
};
