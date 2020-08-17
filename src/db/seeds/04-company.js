exports.seed = (knex, Promise) => knex('ecompany').del()
  .then(() =>
    knex('ecompany').insert(
      [
            {
              ecompanyname: 'PT. Nawakara Perkasa Nusantara',
              ecompanyemailaddress: '@nawakara.com',
              eaddresseaddressid: 1,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now(),
              eindustryeindustryid: 1,
              ecompanyphonenumber: "0881542324123"
            },
            {
              ecompanyname: 'PT. Nawakara Perkasa Nusantara (BRANCH)',
              ecompanyemailaddress: 'nnnj@nawakara.com',
              eaddresseaddressid: 1,
              ecompanyparentid: 1,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now(),
              eindustryeindustryid: 1,
              ecompanyphonenumber: "0881541114555"
            },
            {
              ecompanyname: 'PT. Nawakara Perkasa Nusantara (SISTER)',
              ecompanyemailaddress: 'nj@nawakara.com',
              eaddresseaddressid: 1,
              ecompanyolderid: 1,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now(),
              eindustryeindustryid: 1,
              ecompanyphonenumber: "0712231145123"
            },
            {
              ecompanyname: 'PT. APSSI',
              ecompanyemailaddress: 'yeyen@apssi.com',
              eaddresseaddressid: 2,
              ecompanycreateby: 0,
              ecompanycreatetime: Date.now(),
              eindustryeindustryid: 1
            },
      ]
    ));