const mapDBSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  // eslint-disable-next-line camelcase
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  // eslint-disable-next-line camelcase
  albumId: album_id,
});

const mapSimpleSongModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapAlbum = ({
  id, 
  name,
  year,
  cover,
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
});
module.exports = { mapDBSongModel, mapSimpleSongModel, mapAlbum };
