exports.seed = (knex, Promise) => knex('estate').del()
  .then(() =>
    knex('estate').insert(
      [
        {
          estatename: 'DKI Jakarta',
          ecountryecountryid: 1
        },
      ]
));
