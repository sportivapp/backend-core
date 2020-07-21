exports.seed = (knex, Promise) => knex('estates').del()
  .then(() =>
    knex('estates').insert(
      [
        {
          estatesname: 'Fiordini',
          estatescode: 'ILLAGO'
        }
      ]
));
