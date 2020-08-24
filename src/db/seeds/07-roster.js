exports.seed = (knex, Promise) => knex('eroster').del()
.then(() =>
  knex('eroster').insert(
    [
        {
            erostername: 'nawakara project',
            erosterdescription: 'nawakara first project',
            etimesheetetimesheetid: 1,
            erostercreateby: 2,
            erostercreatetime: Date.now(),
            erosteruserlimit: 3,
            erosterreservelimit: 1
        }
    ]
  ));
