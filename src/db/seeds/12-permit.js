exports.seed = (knex, Promise) => knex('epermit').del()
    .then(() =>
        knex('epermit').insert(
            [
                {
                    epermitdescription: 'nawakara permit staff',
                    epermitstartdate: '2020-12-12',
                    epermitenddate: '2020-24-12',
                    epermitstatus: 0,
                    euseruserid: 5,
                    epermitcreateby: 4
                },
                {
                    epermitdescription: 'nawakara permit danru',
                    epermitstartdate: '2020-12-12',
                    epermitenddate: '2020-24-12',
                    epermitstatus: 0,
                    euseruserid: 4,
                    epermitcreateby: 4
                },
                {
                    epermitdescription: 'nawakara permit pm',
                    epermitstartdate: '2020-12-12',
                    epermitenddate: '2020-24-12',
                    epermitstatus: 0,
                    euseruserid: 3,
                    epermitcreateby: 4
                }
            ]
        ));