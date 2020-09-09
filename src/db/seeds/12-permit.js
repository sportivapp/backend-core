exports.seed = (knex) => knex('epermit').del()
    .then(() =>
        knex('epermit').insert(
            [
                {
                    epermitdescription: 'nawakara permit user2',
                    epermitstartdate: 1597189478546,
                    epermitenddate: 1597489478546,
                    epermitstatus: 'PENDING',
                    euseruserid: 5,
                    epermitcreateby: 4,
                    epermitcreatetime: Date.now()
                },
                {
                    epermitdescription: 'nawakara permit user1',
                    epermitstartdate: 1597189478546,
                    epermitenddate: 1597489478546,
                    epermitstatus: 'CREATED',
                    euseruserid: 4,
                    epermitcreateby: 4,
                    epermitcreatetime: Date.now()
                },
                {
                    epermitdescription: 'nawakara permit pm',
                    epermitstartdate: 1597189478546,
                    epermitenddate: 1597489478546,
                    epermitstatus: 'PENDING',
                    euseruserid: 3,
                    epermitcreateby: 4,
                    epermitcreatetime: Date.now()
                }
            ]
        ));