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
<<<<<<< HEAD
                    eprojectsupervisorid: 3,
=======
                    eprojectcreatetime: Date.now(),
                    eprojectsupervisorid: 1
>>>>>>> development
                },
                {
                    eprojectcode: '1B',
                    eprojectname: 'SatuB',
                    eprojectstartdate: '2020-07-24',
                    eprojectenddate: '2020-12-24',
                    eprojectcreateby: 3,
<<<<<<< HEAD
=======
                    eprojectcreatetime: Date.now(),
>>>>>>> development
                    eprojectsupervisorid: 3
                },
            ]
        ));