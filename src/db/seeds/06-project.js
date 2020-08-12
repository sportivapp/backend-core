exports.seed = (knex, Promise) => knex('eproject').del()
    .then(() =>
        knex('eproject').insert(
            [
                {
                    eprojectcode: '1A',
                    eprojectname: 'SatuA',
                    eprojectstartdate: '2020-07-24',
                    eprojectenddate: '2020-12-24',
                    eprojectcreateby: 1,
                },
                {
                    eprojectcode: '1B',
                    eprojectname: 'SatuB',
                    eprojectstartdate: '2020-07-24',
                    eprojectenddate: '2020-12-24',
                    eprojectcreateby: 3,
                },
            ]
        ));