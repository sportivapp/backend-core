exports.seed = (knex, Promise) => knex('euser').del()
  .then(() =>
    knex('euser').insert(
      [
        {
          euserpermission: 10,
          eusernik: 123456789,
          eusername: 'nawakaraadmin',
          euseremail: 'nawakaraadmin@nawakara.com',
          euserpassword: '$2y$10$UzQchZo/FrFs4UMzrRPp2OXj.tjV495wGW977M4SSczXqdVUWRaKu',
          eusermobilenumber: '987654321',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 9,
          eusernik: 99999999,
          eusername: 'nawakarapm',
          euseremail: 'nawakarapm@nawakara.com',
          euserpassword: '$2y$10$UEM6kdD8I4PEyOxcv9Ypduy5gk.PPaTu6jLnjKLvg2ooZjTxeRsWe',
          eusermobilenumber: '987654321',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 8,
          eusernik: 888888888,
          eusername: 'nawakaradanru',
          euseremail: 'nawakaradanru@nawakara.com',
          euserpassword: '$2y$10$oEZDmIY1CSl0ZiokBajDtukZjH5P3vh.EQSOM2lUJYLjp95it18Fu',
          eusermobilenumber: '888888888',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 1,
          eusernik: 111111111,
          eusername: 'nawakarauser',
          euseremail: 'nawakarauser@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
      ]
    ));