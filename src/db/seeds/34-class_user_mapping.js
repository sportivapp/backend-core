exports.seed = (knex, Promise) => knex('eclassusermapping').del()
    .then(() =>
        knex('eclassusermapping').insert(
            [
                {
                    eclasseclassid: 1,
                    eusereuserid: 7,
                    eclassusermappingstatus: 'REJECTED',
                    eclassusermappingcreatetime: Date.now() - 100000,
                    eclassusermappingcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eusereuserid: 7,
                    eclassusermappingstatus: 'PENDING',
                    eclassusermappingcreatetime: Date.now(),
                    eclassusermappingcreateby: 0
                }
            ]
        ));
