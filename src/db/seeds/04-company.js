exports.seed = (knex, Promise) => knex('ecompany').del()
  .then(() =>
    knex('ecompany').insert(
      [
            {
              ecompanyname: 'PT. Nawakara Perkasa Nusantara',
              ecompanyemailaddress: '@nawakara.com',
              eaddresseaddressid: 1,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now()
            },
            {
              ecompanyname: 'PT. Nawakara Perkasa Nusantara (BRANCH)',
              ecompanyemailaddress: 'nnnj@nawakara.com',
              eaddresseaddressid: 1,
              ecompanyparentid: 1,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now()
            },
            {
              ecompanyname: 'PT. Nawakara Perkasa Nusantara (SISTER)',
              ecompanyemailaddress: 'nj@nawakara.com',
              eaddresseaddressid: 1,
              ecompanyolderid: 1,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now()
            },
      ]
    ));