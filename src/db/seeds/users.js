exports.seed = (knex, Promise) => knex('euser').del()
  .then(() =>
    knex('euser').insert(
      [
        {
          eusernik: 123456789,
          eusername: 'test1',
          euseremail: 'test1@test1.com',
          euserpassword: 'test1',
          eusermobilenumber: '0123456789'
        },
        {
          eusernik: 987654321,
          eusername: 'test2',
          euseremail: 'test2@test2.com',
          euserpassword: 'test2',
          eusermobilenumber: '9876543210'
        }
      ]
    ));