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
        {
          efilename: '20-defend a.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/20-defend a.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '21-defend b.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/21-defend b.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '22-dribbling and running with the ball 1.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/22-dribbling and running with the ball 1.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '23-dribbling and running with the ball 2.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/23-dribbling and running with the ball 2.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '24-APSSI 10 maret.jpg',
          efilepath: process.env.TEMP_DIRECTORY + '/24-APSSI 10 maret.jpg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '25-APSSI Kongres Pertama.jpg',
          efilepath: process.env.TEMP_DIRECTORY + '/25-APSSI Kongres Pertama.jpg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        // 20
        {
          efilename: '26-ucapanselamatketumpssi.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/26-ucapanselamatketumpssi.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '27-ucapanselamat1.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/27-ucapanselamat1.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '28-ucapanselamat1.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/28-ucapanselamat1.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '29-ucapanselamat1.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/29-ucapanselamat1.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '30-ucapanselamat1.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/30-ucapanselamat1.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '31-ucapanselamat1.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/31-ucapanselamat1.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //26
        {
          efilename: '001-Rachmad Darmawan.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/001-Rachmad Darmawan.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '002-Mundari Karya.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/002-Mundari Karya.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '003-Djadjang Nurdjaman.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/003-Djadjang Nurdjaman.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '004-ZUCHLI IMRAN PUTRA SH MH.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/004-ZUCHLI IMRAN PUTRA SH MH.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '005-Yulio Mariem Putra, M. PD.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/005-Yulio Mariem Putra, M. PD.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '006-Yeyen Tumena.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/006-Yeyen Tumena.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '007-Bambang Nurdiansyah SE.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/007-Bambang Nurdiansyah SE.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
      ]
));