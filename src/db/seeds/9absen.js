exports.seed = (knex, Promise) => knex('eabsen').del()
.then(() =>
  knex('eabsen').insert(
    [
        {
            eabsenlocationdistanceaccuracy: '80',
            eabsenstatus: 'Hadir',
            eabsendescription: 'Sehat',
            eabsencreateby: 5,
            eusereuserid: 5
        },
        {
            eabsenlocationdistanceaccuracy: '99',
            eabsenstatus: 'Hadir',
            eabsendescription: 'Sedikit pilek',
            eabsencreateby: 6,
            eusereuserid: 6
        },
        {
            eabsenlocationdistanceaccuracy: '100',
            eabsenstatus: 'Sakit',
            eabsendescription: 'Tidak enak badan',
            eabsencreateby: 7,
            eusereuserid: 7
        },

    ]
  ));
