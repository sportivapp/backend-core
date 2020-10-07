exports.seed = (knex, Promise) => knex('ethreadmoderator').del()
    .then(() =>
        knex('ethreadmoderator').insert(
            [
                {
                    ethreadethreadid: 1,
                    eusereuserid: 1,
                    ethreadmoderatorcreatetime: Date.now(),
                    ethreadmoderatorcreateby: 1
                },
                {
                    ethreadethreadid: 2,
                    eusereuserid: 4,
                    ethreadmoderatorcreatetime: Date.now(),
                    ethreadmoderatorcreateby: 4
                },
            ]
        ));