exports.seed = (knex, Promise) => knex('efile').del()
  .then(() =>
    knex('efile').insert(
      [
        {
          efilename: 'important announcement.png',
          efilepath: '/opt/emtiv-backend/uploads/announcement/1/important announcement.png',
          efiletype: 'image/png',
          efilecreateby: 0,
          efilecreatetime: Date.now()
        }
      ]
));