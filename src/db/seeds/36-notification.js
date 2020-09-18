exports.seed = (knex, Promise) => knex('enotification').del()
    .then(() =>
        knex('enotification').insert(
            [
                {
                    eusereuserid: 1,
                    enotificationbodyenotificationbodyid: 1,
                    enotificationisread: false,
                    enotificationcreateby: 4,
                    enotificationcreatetime: 1575158400,
                    enotificationchangeby: 4,
                    enotificationchangetime: 1575158400
                },
                {
                    eusereuserid: 1,
                    enotificationbodyenotificationbodyid: 2,
                    enotificationisread: false,
                    enotificationcreateby: 5,
                    enotificationcreatetime: Date.now(),
                    enotificationchangeby: 5,
                    enotificationchangetime: Date.now()
                },
                {
                    eusereuserid: 1,
                    enotificationbodyenotificationbodyid: 3,
                    enotificationisread: false,
                    enotificationcreateby: 3,
                    enotificationcreatetime: 1519084800,
                    enotificationchangeby: 3,
                    enotificationchangetime: 1519084800
                },
                {
                    eusereuserid: 1,
                    enotificationbodyenotificationbodyid: 4,
                    enotificationisread: false,
                    enotificationcreateby: 4,
                    enotificationcreatetime: 1583193600,
                    enotificationchangeby: 4,
                    enotificationchangetime: 1583193600
                },
                {
                    eusereuserid: 1,
                    enotificationbodyenotificationbodyid: 5,
                    enotificationisread: false,
                    enotificationcreateby: 5,
                    enotificationcreatetime: Date.now(),
                    enotificationchangeby: 5,
                    enotificationchangetime: Date.now()
                },
            ]
        ));
