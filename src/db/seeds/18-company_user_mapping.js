exports.seed = (knex, Promise) => knex('ecompanyusermapping').del()
    .then(() =>
        knex('ecompanyusermapping').insert(
            [
              {
                ecompanyecompanyid: 1,
                eusereuserid: 1,
                ecompanyusermappingcreateby: 0,
                ecompanyusermappingpermission: 10
              }
            ]
      ));
