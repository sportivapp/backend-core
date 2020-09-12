exports.seed = (knex, Promise) => knex('emobileappversion').del()
  .then(() =>
    knex('emobileappversion').insert(
      [
        {
          emobileappversion: '1.0.0',
          emobileappversionchangetime: 1599842675,
          emobileappversionstatus: 'MAJOR',
          emobileappversionforceupdate: false,
        },
        {
          emobileappversion: '1.1.0',
          emobileappversionchangetime: 1599920340,
          emobileappversionstatus: 'MINOR',
          emobileappversionforceupdate: false,
        }
      ]
));