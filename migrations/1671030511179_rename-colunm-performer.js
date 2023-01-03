exports.up = (pgm) => {
  pgm.renameColumn('songs', 'performance', 'performer');
};

exports.down = (pgm) => {
  pgm.alterColumn('songs', 'performer');
};
