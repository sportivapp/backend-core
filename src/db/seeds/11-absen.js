exports.seed = (knex, Promise) => knex('eabsen').del()
  .then(() =>
    knex('eabsen').insert(
      [
        {
          eabsenclockintime: Date.now(),
          eabsenclockouttime: Date.now() + 1000000,
          eabsencreatetime: Date.now(),
          eabsendescription: 'Sedikit flu',
          eabsencreateby: 4,
          eusereuserid: 4,
          edeviceedeviceid: 1
        },
      ]
    ));