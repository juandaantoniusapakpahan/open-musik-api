/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performance: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'integer',
      allowNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: '"albums"',
      allowNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
