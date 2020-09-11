exports.seed = (knex, Promise) => knex('emobileappversion').del()
  .then(() =>
    knex('emobileappversion').insert(
      [
        {
          emobileappversion: '1.0',
          emobileappversionchangetime: 1599842675,
          emobileappversionstatus: 'MAJOR'
        }
      ]
));