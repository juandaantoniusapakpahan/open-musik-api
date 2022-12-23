const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService) {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
    // eslint-disable-next-line no-underscore-dangle
    this._collaborationService = collaborationService;
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

  async getPlaylists(userId) {
    // eslint-disable-next-line no-return-await, no-underscore-dangle

    const query = {
      text: `SELECT py.id, py.name, us.username FROM playlists py
      LEFT JOIN collaborations cb ON py.id = cb.playlist_id
      LEFT JOIN users us ON py.owner = us.id
      WHERE cb.user_id = $1 OR py.owner = $1`,
      values: [userId],
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
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        // eslint-disable-next-line no-underscore-dangle
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
