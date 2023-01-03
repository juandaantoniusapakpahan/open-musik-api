exports.up = (pgm) => {
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id.id', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');

  // eslint-disable-next-line max-len
  // ### EXAMPLE pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id.id');
  // ### EXAMPLE pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id');
};
