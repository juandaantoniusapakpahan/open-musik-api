/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('songs', 'performance', 'performer');
};

exports.down = (pgm) => {
  pgm.alterColumn('songs', 'performer');
};
