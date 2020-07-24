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