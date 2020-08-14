exports.seed = (knex) => knex('egrade').del()
    .then(() =>
        knex('egrade').insert(
            [
                {
                    egradedescription: 'grade position A',
                    egradename: 'Position A',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    edepartmentedepartmentid: 1
                },
                {
                    egradedescription: 'grade position B',
                    egradename: 'Position B',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 1,
                    edepartmentedepartmentid: 1
                },
                {
                    egradedescription: 'grade position C',
                    egradename: 'Position C',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 2,
                    edepartmentedepartmentid: 1
                }
            ]
        ));