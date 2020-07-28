exports.seed = (knex, Promise) => knex('eannouncement').del()
.then(() =>
  knex('eannouncement').insert(
    [
        {
            eannouncementtitle: 'nawakara announcement',
            eannouncementcontent: 'nawakara first announcement',
            eannouncementcreateby: 4
        }
    ]
  ));
