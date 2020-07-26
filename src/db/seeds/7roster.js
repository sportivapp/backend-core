exports.seed = (knex, Promise) => knex('eroster').del()
.then(() =>
  knex('eroster').insert(
    [
        {
            'erostername': 'test1',
            'erosterdescription': 'this is test1',
            'eprojecteprojectid': 1,
            'erostercreateby': 2
        }
    ]
  ));
