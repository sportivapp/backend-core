exports.seed = (knex, Promise) => knex('etimesheet').del()
    .then(() =>
        knex('etimesheet').insert(
            [
                {
                    etimesheetname: 'Nawakara Timesheet',
                    etimesheetcreateby: 1,
                    etimesheetrostercount: 3,
                    etimesheetcreatetime: Date.now()
                }
            ]
        ));
