exports.seed = (knex, Promise) => knex('erosterusermapping').del()
    .then(() =>
        knex('erosterusermapping').insert(
            [
                {
                    erostererosterid: 1,
                    eusereuserid: 4,
                    erosterusermappingcreateby: 0,
                    erosterusermappingcreatetime: Date.now()
                }
            ]
        ));
