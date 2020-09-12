exports.seed = (knex, Promise) => knex('eclassusermapping').del()
    .then(() =>
        knex('eclassusermapping').insert(
            [
                {
                    eclasseclassid: 1,
                    eusereuserid: 7,
                    eclassusermappingstatus: 'PENDING',
                    eclassusermappingcreatetime: Date.now(),
                    eclassusermappingcreateby: 0
                }
            ]
        ));
