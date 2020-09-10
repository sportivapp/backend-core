require('dotenv').config();

exports.seed = (knex, Promise) => knex('efile').del()
  .then(() =>
    knex('efile').insert(
      [
        {
          efilename: 'important announcement.png',
          efilepath: process.env.TEMP_DIRECTORY + '/important announcement.png',
          efiletype: 'image/png',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: 'satufirstunocarousel1.jpg',
          efilepath: process.env.TEMP_DIRECTORY + '/satufirstunocarousel1.jpg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: 'duasecondduocarousel1.jpg',
          efilepath: process.env.TEMP_DIRECTORY + '/duasecondduocarousel1.jpg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
      ]
));