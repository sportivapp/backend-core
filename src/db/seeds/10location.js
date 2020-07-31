exports.seed = (knex, Promise) => knex('elocation').del()
  .then(() =>
    knex('elocation').insert(
      [
        {
          elocationcode: 'Area 50',
          elocationname: 'Forbidden Zone',
          elocationdescription: 'Naruto runners',
          elocationlongitude: '-1',
          elocationlatitude: '-2',
          elocationcreateby: 0,
          edeviceedeviceid: 1
        },
      ]
    ));