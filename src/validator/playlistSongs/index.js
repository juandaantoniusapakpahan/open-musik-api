const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistSongsSchema } = require('./schema');

const PlaylistSongsValidator = {
  playlistSongValidate: (payload) => {
    const result = PlaylistSongsSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
