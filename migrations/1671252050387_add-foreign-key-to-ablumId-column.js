exports.up = (pgm) => {
  // Memberikan constraint foreign key pada owner terhadap kolom id dari table users
  pgm.addConstraint('songs', 'fk_songs.album_albums.id', 'FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_albums.id');
};
