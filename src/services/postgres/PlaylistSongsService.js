const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  async addPlaylistSongs(plalylistId, songId) {
    const id = `playsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, plalylistId, songId],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan songs');
    }
  }

  async getPlaylistSongsById(playlistId) {
    const playlist = {
      text: 'SELECT py.id, py.name, us.username FROM playlists py LEFT JOIN users us ON py.owner = us.id WHERE py.id = $1',
      values: [playlistId],
    };
    const query = {
      text: 'SELECT ps.id, sg.title, sg.performer FROM playlist_songs ps LEFT JOIN playlists pl ON ps.playlist_id = pl.id LEFT JOIN songs sg ON ps.song_id = sg.id WHERE ps.playlist_id = $1',
      values: [playlistId],
    };
    // eslint-disable-next-line no-underscore-dangle
    const playlistResult = await this._pool.query(playlist);
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Tidak ada lagu pada Playlist');
    }

    playlistResult.rows[0].songs = result.rows;
    return playlistResult.rows[0];
  }

  async deletePlaylistSongsById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mengahapus. Id Playlist atau song tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
