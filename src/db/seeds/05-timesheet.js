exports.seed = (knex, Promise) => knex('etimesheet').del()
    .then(() =>
        knex('etimesheet').insert(
            [
                {
                    etimesheetname: 'Nawakara Timesheet',
                    etimesheetcreateby: 1,
                    etimesheetrostercount: 1,
                    etimesheetcreatetime: Date.now(),
                    eshifteshiftid: 1,
                    ecompanyecompanyid: 1
                }
            ]
        ));
