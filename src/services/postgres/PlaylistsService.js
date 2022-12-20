const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  async addPlaylists({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    // eslint-disable-next-line no-underscore-dangle
    const playlistId = await this._pool.query(query);

    if (!playlistId.rows.length) {
      throw new InvariantError('Gagal menambahkan Playlist');
    }
    return playlistId.rows[0].id;
  }

  async getPlaylists(id) {
    // eslint-disable-next-line no-return-await, no-underscore-dangle

    const query = {
      text: 'SELECT pl.id, pl.name, us.username FROM playlists as pl LEFT JOIN users as us on pl.owner = us.id WHERE pl.owner = $1',
      values: [id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylists(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
