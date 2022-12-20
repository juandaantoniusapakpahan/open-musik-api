const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistsSchema } = require('./schema');

const ValidatorPlaylistsPayload = {
  playlistsPayloadValidate: (payload) => {
    const result = PlaylistsSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ValidatorPlaylistsPayload;
