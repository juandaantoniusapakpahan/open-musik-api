const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async checkLikeAlbum(userId, albumId) {
    const query = {
      text: 'SELECT id, user_id, album_id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    return result;
  }

  async likeAlbum(userId, albumId) {

    const checkAlbumQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const resultCheckAlbum = await this._pool.query(checkAlbumQuery);

    if (!resultCheckAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }


    const resultCheck = await this.checkLikeAlbum(userId, albumId);

    if (!resultCheck.rows.length) {
      const id = `like-${nanoid(16)}`;
      const query = {
        text: 'INSERT INTO user_album_likes values($1, $2, $3)',
        values: [id, userId, albumId],
      };
      await this._pool.query(query);
      return;
    }
    await this.disLikeAlbum(userId, albumId);
    await this._cacheService.delete(`likes:${albumId}`);
    return;
  }

  async disLikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
  }

  async getAlbumLikes(albumId) {
    const checkAlbum = {
      text: 'SELECT id, name FROM albums WHERE id = $1',
      values: [albumId],
    };

    const resultCheckAlbum = await this._pool.query(checkAlbum);

    if (!resultCheckAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rows.length));

    return result.rows.length;
  }
}


module.exports = UserAlbumLikeService;