exports.seed = (knex, Promise) => knex('esporttype').del()
  .then(() =>
    knex('esporttype').insert(
      [
        {
          esporttypename: 'Sepak Bola',
        },
        {
          esporttypename: 'Futsal',
        },
        {
          esporttypename: 'Basket',
        },
        {
          esporttypename: 'Badminton',
        },
        {
          esporttypename: 'Volley',
        },
        {
          esporttypename: 'Tennis',
        },
      ]
    ));