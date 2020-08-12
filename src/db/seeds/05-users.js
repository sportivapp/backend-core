exports.seed = (knex, Promise) => knex('euser').del()
  .then(() =>
    knex('euser').insert(
      [
        {
          eusernik: 'E1',
          eusername: 'nawakaraadmin',
          euseremail: 'nawakaraadmin@nawakara.com',
          euserpassword: '$2y$10$UzQchZo/FrFs4UMzrRPp2OXj.tjV495wGW977M4SSczXqdVUWRaKu',
          eusermobilenumber: '987654321',
          ecompanyecompanyid: 1
        },
        {
          eusernik: 'E2',
          eusername: 'nawakarahrd',
          euseremail: 'nawakarahrd@nawakara.com',
          euserpassword: '$2y$10$WdQCsI5fJycPmk4OVOzl0O70qSQAF44UFADY/2LuX3X5X15jQfns6',
          eusermobilenumber: '987654321',
          ecompanyecompanyid: 1
        },
        {
          eusernik: 'E3',
          eusername: 'nawakarapm',
          euseremail: 'nawakarapm@nawakara.com',
          euserpassword: '$2y$10$Bvc8IkjHw420Eu7T/PbwwOfnKRuhy0NP3P3FwLkm7hdzPJ2lFdvs.',
          eusermobilenumber: '888888888',
          ecompanyecompanyid: 1
        },
        {
          eusernik: 'E4',
          eusername: 'nawakarauser1',
          euseremail: 'nawakarauser1@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
        {
          eusernik: 'E5',
          eusername: 'nawakarauser2',
          euseremail: 'nawakarauser2@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
        {
          eusernik: 'E6',
          eusername: 'nawakarauser3',
          euseremail: 'nawakarauser3@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          ecompanyecompanyid: 1
        },
      ]
    ));