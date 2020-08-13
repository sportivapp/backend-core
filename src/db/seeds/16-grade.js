exports.seed = (knex) => knex('egrade').del()
    .then(() =>
        knex('egrade').insert(
            [
                {
                    egradedescription: 'grade position A',
                    egradename: 'Position A',
                    ecompanycompanyid: 1,
                    egradecreateby: 1
                },
                {
                    egradedescription: 'grade position B',
                    egradename: 'Position B',
                    ecompanycompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 1,
                },
                {
                    egradedescription: 'grade position C',
                    egradename: 'Position C',
                    ecompanycompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 2,
                }
            ]
        ));