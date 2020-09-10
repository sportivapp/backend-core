exports.seed = (knex, Promise) => knex('ecountry').del()
  .then(() =>
    knex('ecountry').insert(
      [
        {
          ecountryname: 'Indonesia'
        },
        {
          ecountryname: 'Brunei Darussalam'
        },
        {
          ecountryname: 'Kamboja'
        },
        {
          ecountryname: 'Laos'
        },
        {
          ecountryname: 'Malaysia'
        },
        {
          ecountryname: 'Myanmar'
        },
        {
          ecountryname: 'Filipina'
        },
        {
          ecountryname: 'Singapura'
        },
        {
          ecountryname: 'Thailand'
        },
        {
          ecountryname: 'Vietnam'
        },
      ]
));