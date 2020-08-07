exports.seed = (knex, Promise) => knex('eabsen').del()
  .then(() =>
    knex('eabsen').insert(
      [
        {
          eabsentime: 1584693012,
          eabsenstatus: 'Hadir',
          eabsendescription: 'Sedikit flu',
          eabsencreateby: 4,
          eusereuserid: 4,
          elocationelocationid: 1
        },
      ]
    ));