exports.seed = (knex, Promise) => knex('ecompany').del()
  .then(() =>
    knex('ecompany').insert(
      [
        {
          ecompanyname: 'PT. Nawakara Perkasa Nusantara',
          ecompanyemailaddress: '@nawakara.com',
          eaddresseaddressid: 1,
          ecompanycreateby: 0
        },
      ]
    ));