const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBSongModel, mapSimpleSongModel } = require('../../utils');

class SongService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  // eslint-disable-next-line class-methods-use-this
  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    if (title !== undefined && performer !== undefined) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE lower(title) LIKE lower($1) AND lower(performer) LIKE lower($2)',
        values: [`%${title}%`, `%${performer}%`],
      };
      // eslint-disable-next-line no-underscore-dangle
      const result = await this._pool.query(query);
      return result.rows.map(mapSimpleSongModel);
    }

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query('SELECT id, title, performer FROM songs sg;');
    return result.rows.map(mapSimpleSongModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, album_id FROM songs where id=$1',
      values: [id],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBSongModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6, updated_at=$7 WHERE id=$8 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal diperbarui. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongsById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal ditambahkan. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
