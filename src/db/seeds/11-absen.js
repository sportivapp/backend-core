exports.seed = (knex, Promise) => knex('eabsen').del()
  .then(() =>
    knex('eabsen').insert(
      [
        {
          eabsentime: Date.now(),
          eabsenstatus: 'Hadir',
          eabsendescription: 'Sedikit flu',
          eabsencreateby: 4,
          eusereuserid: 4,
          elocationelocationid: 1
        },
      ]
    ));