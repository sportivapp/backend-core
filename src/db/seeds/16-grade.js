exports.seed = (knex) => knex('epermit').del()
    .then(() =>
        knex('egrade').insert(
            [
                {
                    egradedescription: 'grade position A',
                    egradename: 'Position A',
                    ecompanycompanyid: 1,
                    egradecreateby: 1
                }
            ]
        ));