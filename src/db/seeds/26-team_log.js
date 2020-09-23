exports.seed = (knex, Promise) => knex('eteamlog').del()
.then(() =>
  knex('eteamlog').insert(
    [
        {
            eusereuserid: 4,
            eteameteamid: 1,
            eteamlogtype: 'INVITE',
            eteamlogstatus: 'PENDING',
            eteamlogcreatetime: Date.now(),
            eteamlogcreateby: 1,
            eteamlogchangetime: Date.now(),
            eteamlogchangeby: 1
        },
        {
          eusereuserid: 6,
          eteameteamid: 1,
          eteamlogtype: 'APPLY',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 6,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 6
        },
        {
          eusereuserid: 4,
          eteameteamid: 2,
          eteamlogtype: 'APPLY',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 4,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 4
        },
        {
          eusereuserid: 5,
          eteameteamid: 2,
          eteamlogtype: 'APPLY',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 5,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 5
        },
        {
          eusereuserid: 6,
          eteameteamid: 2,
          eteamlogtype: 'APPLY',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 6,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 6
        },
        {
          eusereuserid: 4,
          eteameteamid: 3,
          eteamlogtype: 'INVITE',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 4,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 4
        },
        {
          eusereuserid: 5,
          eteameteamid: 3,
          eteamlogtype: 'INVITE',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 5,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 5
        },
        {
          eusereuserid: 6,
          eteameteamid: 3,
          eteamlogtype: 'INVITE',
          eteamlogstatus: 'PENDING',
          eteamlogcreatetime: Date.now(),
          eteamlogcreateby: 6,
          eteamlogchangetime: Date.now(),
          eteamlogchangeby: 6
        },
    ]
  ));
