exports.seed = (knex, Promise) => knex('ethreadpost').del()
    .then(() =>
        knex('ethreadpost').insert(
            [
                {
                    ethreadpostcomment: 'Kalau menurut saya tergantung dari situasi pertandingan',
                    ethreadethreadid: 1,
                    efileefileid: null,
                    ethreadpostcreatetime: Date.now(),
                    ethreadpostcreateby: 2
                },
                {
                    ethreadpostcomment: 'Menurut saya sih lebih baik menentukan strateginya dengan mengetahui lawan',
                    ethreadethreadid: 1,
                    efileefileid: null,
                    ethreadpostcreatetime: Date.now(),
                    ethreadpostcreateby: 3
                },
                {
                    ethreadpostcomment: 'Apakah itu benar? coba ditanyakan dulu ke pelatihnya yang lebih pengalaman',
                    ethreadethreadid: 1,
                    efileefileid: null,
                    ethreadpostcreatetime: Date.now(),
                    ethreadpostcreateby: 5
                },
                {
                    ethreadpostcomment: 'Perenggangan? sepengalaman saya sih tergantung olahraganya apa, kalau sepakbola baiknya banyak - banyakan pemanasan di kaki',
                    ethreadethreadid: 2,
                    efileefileid: null,
                    ethreadpostcreatetime: Date.now(),
                    ethreadpostcreateby: 5
                },
            ]
        ));