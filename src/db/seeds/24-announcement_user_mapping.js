exports.seed = (knex, Promise) => knex('eannouncementusermapping').del()
.then(() =>
  knex('eannouncementusermapping').insert(
    [
        {
            eannouncementeannouncementid: 1,
            eusereuserid: 1
        },
        {
          eannouncementeannouncementid: 1,
          eusereuserid: 7
      },
    ]
  ));
