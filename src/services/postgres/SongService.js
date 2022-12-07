const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotFoundError');
const { mapDBSongModel } = require('../../utils');

class SongService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  // eslint-disable-next-line class-methods-use-this
  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    // eslint-disable-next-line no-underscore-dangle
    const songId = await this._pool.query(query);

    if (!songId.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return songId.rows[0].id;
  }

  async getSongs(title, performer) {
    if (title !== undefined && performer !== undefined) {
      // eslint-disable-next-line no-underscore-dangle
      const songs = await this._pool.query('SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2', [`%${title}%`, `%${performer}%`]);
      return songs.rows;
    }

    if (performer !== undefined && title === undefined) {
      // eslint-disable-next-line no-underscore-dangle
      const songs = await this._pool.query('SELECT id, title, performer FROM songs WHERE performer ILIKE $1', [`%${performer}%`]);
      return songs.rows;
    }
    // eslint-disable-next-line no-underscore-dangle
    if (title !== undefined) {
      // eslint-disable-next-line no-underscore-dangle
      const songs = await this._pool.query('SELECT id, title, performer FROM songs WHERE title ILIKE $1', [`%${title}%`]);
      return songs.rows;
    }
    // eslint-disable-next-line no-underscore-dangle
    const songs = await this._pool.query('SELECT id, title, performer FROM songs');
    return songs.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs where songs.id=$1',
      values: [id],
    };

    // eslint-disable-next-line no-underscore-dangle
    const song = await this._pool.query(query);

    if (!song.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return song.rows.map(mapDBSongModel)[0];
  }

  async putSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal diperbarui. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE songs.id=$1 RETURNING id',
      values: [id],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
