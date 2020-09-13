exports.seed = (knex, Promise) => knex('ecompanyusermapping').del()
    .then(() =>
        knex('ecompanyusermapping').insert(
            [
                {
                    ecompanyecompanyid: 1,
                    eusereuserid: 1,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 1,
                    eusereuserid: 2,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 9
                },
                {
                    ecompanyecompanyid: 1,
                    eusereuserid: 3,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 8
                },
                {
                    ecompanyecompanyid: 1,
                    eusereuserid: 4,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 1,
                    eusereuserid: 5,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 1,
                    eusereuserid: 6,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 2,
                    eusereuserid: 5,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 2,
                    eusereuserid: 1,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 3,
                    eusereuserid: 1,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 4,
                    eusereuserid: 7,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 5,
                    eusereuserid: 7,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                // APSSI
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 8,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 9,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 10,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 11,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 12,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 13,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 14,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 10
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 15,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 16,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 17,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 18,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                },
                {
                    ecompanyecompanyid: 6,
                    eusereuserid: 19,
                    ecompanyusermappingcreateby: 0,
                    ecompanyusermappingpermission: 1
                }
            ]
      ));
