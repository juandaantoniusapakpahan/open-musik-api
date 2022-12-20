const routes = require('./routes');
const PlalyistSongsHandler = require('./handler');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistSongsService,
    songsService,
    playlistsService,
    validator,
  }) => {
    // eslint-disable-next-line max-len
    const plalyistSongsHandler = new PlalyistSongsHandler(playlistSongsService, songsService, playlistsService, validator);
    server.route(routes(plalyistSongsHandler));
  },
};
