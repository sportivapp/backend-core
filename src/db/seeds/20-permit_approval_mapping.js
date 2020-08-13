exports.seed = (knex, Promise) => knex('epermitapprovalmapping').del()
    .then(() =>
        knex('epermitapprovalmapping').insert(
            [
                {
                    epermitepermitid: 1,
                    eusereuserid: 3,
                    epermitapprovalmappingcreateby: 5,
                    epermitapprovalmappingcreatetime: Date.now()
                }
            ]
        ));
