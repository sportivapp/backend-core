exports.seed = (knex, Promise) => knex('eproject').del()
    .then(() =>
        knex('eproject').insert(
            [
                {
                    eprojectcode: '1A',
                    eprojectname: 'SatuA',
                    eprojectstartdate: new Date(2020, 11, 23).getTime(),
                    eprojectenddate: new Date(2020, 11, 24).getTime(),
                    eprojectsupervisorid: 3,
                    eprojectcreateby: 1,
                    eprojectcreatetime: Date.now(),
                    eprojectsupervisorid: 1,
                    etimesheetetimesheetid: 1,
                    ecompanyecompanyid: 1
                },
                {
                    eprojectcode: '1B',
                    eprojectname: 'SatuB',
                    eprojectstartdate: new Date(2020, 11, 23).getTime(),
                    eprojectenddate: new Date(2020, 11, 24).getTime(),
                    eprojectsupervisorid: 3,
                    eprojectcreateby: 3,
                    eprojectcreatetime: Date.now(),
                    eprojectsupervisorid: 3,
                    etimesheetetimesheetid: 1,
                    ecompanyecompanyid: 1
                },
            ]
        ));