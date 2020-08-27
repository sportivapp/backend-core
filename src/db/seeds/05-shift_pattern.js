exports.seed = (knex, Promise) => knex('eshiftpattern').del()
    .then(() =>
        knex('eshiftpattern').insert(
            [
                {
                    eshiftpatternstarttime: Date.now(),
                    eshiftpatternendtime: new Date().setMonth(new Date().getMonth() + 1),
                    eshiftpatterncreateby: 1,
                    eshiftpatterncreatetime: Date.now(),
                    eshifteshiftid: 1
                }
            ]
        ));
