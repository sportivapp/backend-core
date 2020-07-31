exports.seed = (knex, Promise) => knex('eroster').del()
.then(() =>
  knex('eroster').insert(
    [
        {
            erostername: 'nawakara project',
            erosterdescription: 'nawakara first project',
            eprojecteprojectid: 1,
            erostercreateby: 2
        }
    ]
  ));
