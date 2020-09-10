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
        {
          efilename: '10-attack.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/10-attack.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '11-ball feeling A.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/11-ball feeling A.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '12-ball feeling B.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/12-ball feeling B.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '13-heading dan shooting 1.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/13-heading dan shooting 1.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '14-heading dan shooting 2.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/14-heading dan shooting 2.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '15-passing dan control A.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/15-passing dan control A.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '16-passing dan control B.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/16-passing dan control B.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '17-shielding and turning B.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/17-shielding and turning B.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '18-shielding and turning.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/18-shielding and turning.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '19-small side games.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/19-small side games.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
      ]
));