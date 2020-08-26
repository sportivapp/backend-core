exports.seed = (knex, Promise) => knex('eannouncement').del()
.then(() =>
  knex('eannouncement').insert(
    [
        {
            eannouncementtitle: 'System Announcement',
            eannouncementcontent: 'Lorem ipsum dimsum',
            eannouncementcreateby: 0
        }
    ]
  ));
