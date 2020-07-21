exports.seed = (knex, Promise) => knex('ecountry').del()
  .then(() =>
    knex('ecountry').insert(
      [
        {
          ecountryname: 'Indo'
        }
      ]
));