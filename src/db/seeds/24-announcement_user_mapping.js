exports.seed = (knex, Promise) => knex('eannouncementusermapping').del()
.then(() =>
  knex('eannouncementusermapping').insert(
    [
        {
            eannouncementusermappingid: 1,
            eannouncementeannouncementid: 1,
            eusereuserid: 1
        },
        {
          eannouncementusermappingid: 1,
          eannouncementeannouncementid: 1,
          eusereuserid: 7
      },
    ]
  ));
