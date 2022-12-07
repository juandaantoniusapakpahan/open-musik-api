const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotFoundError');
// const NotFoundError = require('../../exeptions/NotFoundError');

class AlbumsService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return id;
  }

  async getAlbumById(id) {
    // eslint-disable-next-line no-underscore-dangle
    const query = {
      text: 'SELECT * FROM albums WHERE albums.id=$1',
      values: [id],
    };
    const querySong = {
      text: 'SELECT id, title, year FROM songs where songs.album_id=$1',
      values: [id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const album = await this._pool.query(query);
    // eslint-disable-next-line no-underscore-dangle
    const songs = await this._pool.query(querySong);

    if (!album.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const result = album.rows[0];
    result.songs = songs.rows;
    return result;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums where id=$1 RETURNING id',
      values: [id],
    };
    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
