const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistActivitiesService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  async addPlaylistActivities(playlistId, songId, userId, action) {
    const id = `act-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    // eslint-disable-next-line no-underscore-dangle
    await this._pool.query(query);
  }

  async getPlaylistActivities(PlaylistId) {
    const query = {
      text: `SELECT us.username, sg.title, psa.action, psa.time 
            FROM playlists py
            RIGHT JOIN playlist_song_activities psa ON py.id = psa.playlist_id
            LEFT JOIN users us ON psa.user_id = us.id
            LEFT JOIN songs sg ON psa.song_id = sg.id
            WHERE py.id = $1`,
      values: [PlaylistId],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf playlist tidak ditemukan');
    }
    return result.rows;
  }
}
module.exports = PlaylistActivitiesService;
