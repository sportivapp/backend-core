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
          efilename: '00001-attack.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00001-attack.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00002-ball feeling A.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00002-ball feeling A.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00003-ball feeling B.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00003-ball feeling B.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00004-heading dan shooting 1.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00004-heading dan shooting 1.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00005-heading dan shooting 2.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00005-heading dan shooting 2.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00006-passing dan control A.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00006-passing dan control A.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00007-passing dan control B.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00007-passing dan control B.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00008-shielding and turning B.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00008-shielding and turning B.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00009-shielding and turning.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00009-shielding and turning.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00010-small side games.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00010-small side games.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00011-defend a.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00011-defend a.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00012-defend b.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00012-defend b.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00013-dribbling and running with the ball 1.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00013-dribbling and running with the ball 1.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00014-dribbling and running with the ball 2.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00014-dribbling and running with the ball 2.mp4',
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
          efilename: '00015-ucapanselamatketumpssi.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/00015-ucapanselamatketumpssi.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00016-ucapanselamat1.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/00016-ucapanselamat1.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00017-ucapanselamat2.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/00017-ucapanselamat2.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00018-ucapanselamat3.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/00018-ucapanselamat3.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00019-ucapanselamat4.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/00019-ucapanselamat4.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00020-ucapanselamat5.MP4',
          efilepath: process.env.TEMP_DIRECTORY + '/00020-ucapanselamat5.MP4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //26
        {
          efilename: '001-Rahmad Darmawan.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/001-Rahmad Darmawan.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //27
        {
          efilename: '002-Mundari Karya.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/002-Mundari Karya.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //28
        {
          efilename: '003-Djadjang Nurdjaman.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/003-Djadjang Nurdjaman.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //29
        {
          efilename: '004-ZUCHLI IMRAN PUTRA SH MH.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/004-ZUCHLI IMRAN PUTRA SH MH.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //30
        {
          efilename: '005-Yulio Mariem Putra, M. PD.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/005-Yulio Mariem Putra, M. PD.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //31
        {
          efilename: '006-Yeyen Tumena.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/006-Yeyen Tumena.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //32
        {
          efilename: '007-Bambang Nurdiansyah SE.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/007-Bambang Nurdiansyah SE.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //33
        {
          efilename: '008-Weshley Hutagalung.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/008-Weshley Hutagalung.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '009-Heru Pujihartono.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/009-Heru Pujihartono.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        // 35
        {
          efilename: '00021-ucapanselamatriau.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00021-ucapanselamatriau.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00022-ucapanselamatkaltim.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00022-ucapanselamatkaltim.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00023-ucapanselamatntb.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00023-ucapanselamatntb.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00024-ucapanselamatsulbar.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00024-ucapanselamatsulbar.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00025-ucapanselamatjambi.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00025-ucapanselamatjambi.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00026-ucapanselamatbanten.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00026-ucapanselamatbanten.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00027-ucapanselamatmalukuutara.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00027-ucapanselamatmalukuutara.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00028-ucapanselamatbabel.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00028-ucapanselamatbabel.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00029-ucapanselamatkepri.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00029-ucapanselamatkepri.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00030-ucapanselamatsumbar.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00030-ucapanselamatsumbar.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00031-ucapanselamatsulteng.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00031-ucapanselamatsulteng.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00032-ucapanselamatdiy.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00032-ucapanselamatdiy.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00033-ucapanselamatsulsel.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00033-ucapanselamatsulsel.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00034-ucapanselamatsultra.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00034-ucapanselamatsultra.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00035-ucapanselamataceh.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00035-ucapanselamataceh.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00036-ucapanselamatsumsel.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00036-ucapanselamatsumsel.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00037-ucapanselamatkalut.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00037-ucapanselamatkalut.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00038-ucapanselamatfossbi1.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00038-ucapanselamatfossbi1.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00039-ucapanselamatfossbi2.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00039-ucapanselamatfossbi2.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00040-ucapanselamatjabar.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00040-ucapanselamatjabar.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00041-ucapanselamatbengkulu.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00041-ucapanselamatbengkulu.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00042-ucapanselamatlampung.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00042-ucapanselamatlampung.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00043-ucapanselamatkalteng.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00043-ucapanselamatkalteng.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '00044-ucapanselamatbanten.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00044-ucapanselamatbanten.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //59
        {
          efilename: '00045-ucapanselamatsumut.mp4',
          efilepath: process.env.TEMP_DIRECTORY + '/00045-ucapanselamatsumut.mp4',
          efiletype: 'video/mp4',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        //60
        {
          efilename: '010-Emral Abus.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/010-Emral Abus.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '011-Miftahudin, SH.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/011-Miftahudin, SH.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '012-Syafrianto Rusli.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/012-Syafrianto Rusli.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '013-Galih Purnanda Sakti.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/013-Galih Purnanda Sakti.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '014-Ali Reza.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/014-Ali Reza.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        },
        {
          efilename: '015-Fabriant Immanuel Leleng.jpeg',
          efilepath: process.env.TEMP_DIRECTORY + '/015-Fabriant Immanuel Leleng.jpeg',
          efiletype: 'image/jpg',
          efilesize: 1,
          efilecreateby: 0,
          efilecreatetime: Date.now()
        }
      ]
));