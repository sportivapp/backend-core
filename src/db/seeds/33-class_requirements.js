exports.seed = (knex, Promise) => knex('eclassrequirement').del()
    .then(() =>
        knex('eclassrequirement').insert(
            [
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Requirement 1',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Requirement 2',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Requirement A',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Requirement B',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                }
            ]
        ));
