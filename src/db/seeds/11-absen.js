exports.seed = (knex, Promise) => knex('eabsen').del()
  .then(() =>
    knex('eabsen').insert(
      [
        {
          eabsentime: '31-Jul-2020 08:07:03 GMT+0000',
          eabsenstatus: 'Hadir',
          eabsendescription: 'Sedikit flu',
          eabsencreateby: 4,
          eusereuserid: 4,
          elocationelocationid: 1
        },
      ]
    ));