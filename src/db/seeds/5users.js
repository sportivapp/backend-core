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
          eusernik: 999999999,
          eusername: 'nawakarahrd',
          euseremail: 'nawakarahrd@nawakara.com',
          euserpassword: '$2y$10$WdQCsI5fJycPmk4OVOzl0O70qSQAF44UFADY/2LuX3X5X15jQfns6',
          eusermobilenumber: '987654321',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 8,
          eusernik: 888888888,
          eusername: 'nawakarapm',
          euseremail: 'nawakarapm@nawakara.com',
          euserpassword: '$2y$10$Bvc8IkjHw420Eu7T/PbwwOfnKRuhy0NP3P3FwLkm7hdzPJ2lFdvs.',
          eusermobilenumber: '888888888',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 1,
          eusernik: 111111111,
          eusername: 'nawakarauser1',
          euseremail: 'nawakarauser1@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 1,
          eusernik: 111111111,
          eusername: 'nawakarauser2',
          euseremail: 'nawakarauser2@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
        {
          euserpermission: 1,
          eusernik: 111111111,
          eusername: 'nawakarauser3',
          euseremail: 'nawakarauser3@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
      ]
    ));