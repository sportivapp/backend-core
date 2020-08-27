exports.seed = (knex, Promise) => knex('eshift').del()
    .then(() =>
        knex('eshift').insert(
            [
                {
                    eshiftname: 'Shift Nawakara',
                    eshiftstartdate: Date.now(),
                    eshiftenddate: new Date().setMonth(new Date().getMonth() + 1),
                    eshiftcreateby: 1,
                    eshiftcreatetime: Date.now(),
                    ecompanyecompanyid: 1
                }
            ]
        ));
