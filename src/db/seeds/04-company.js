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
        {
          ecompanyname: 'PT. Nawakara Nusantara Jaya',
          ecompanyemailaddress: 'nnj@nawakara.com',
          eaddresseaddressid: 2,
          ecompanycreateby: 0
        }
      ]
    ));