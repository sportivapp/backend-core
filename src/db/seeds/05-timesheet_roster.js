exports.seed = (knex, Promise) => knex('eroster').del()
.then(() =>
  knex('eroster').insert(
    [
        {
            erostername: 'Tim A',
            erosterdescription: 'Tim A of Timesheet 1',
            etimesheetetimesheetid: 1,
            erostercreateby: 1,
            erostercreatetime: Date.now(),
            erosteruserlimit: 1,
            erosterreservelimit: 0
        }
    ]
  ));
