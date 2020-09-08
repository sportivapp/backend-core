exports.seed = (knex, Promise) => knex('eteamusermapping').del()
.then(() =>
  knex('eteamusermapping').insert(
    [
        {
            eteameteamid: 1,
            eusereuserid: 1,
            eteamusermappingposition: 'ADMIN',
            eteamusermappingcreatetime: Date.now(),
            eteamusermappingcreateby: 1,
            eteamusermappingchangetime: Date.now(),
            eteamusermappingchangeby: 1
        },
        {
          eteameteamid: 1,
          eusereuserid: 2,
          eteamusermappingposition: 'MEMBER',
          eteamusermappingcreatetime: Date.now(),
          eteamusermappingcreateby: 1,
          eteamusermappingchangetime: Date.now(),
          eteamusermappingchangeby: 1
        },
        {
          eteameteamid: 2,
          eusereuserid: 1,
          eteamusermappingposition: 'ADMIN',
          eteamusermappingcreatetime: Date.now(),
          eteamusermappingcreateby: 1,
          eteamusermappingchangetime: Date.now(),
          eteamusermappingchangeby: 1
        },
        {
          eteameteamid: 2,
          eusereuserid: 2,
          eteamusermappingposition: 'MEMBER',
          eteamusermappingcreatetime: Date.now(),
          eteamusermappingcreateby: 2,
          eteamusermappingchangetime: Date.now(),
          eteamusermappingchangeby: 2
        },
        {
          eteameteamid: 3,
          eusereuserid: 1,
          eteamusermappingposition: 'ADMIN',
          eteamusermappingcreatetime: Date.now(),
          eteamusermappingcreateby: 1,
          eteamusermappingchangetime: Date.now(),
          eteamusermappingchangeby: 1
        },
        {
          eteameteamid: 2,
          eusereuserid: 3,
          eteamusermappingposition: 'MEMBER',
          eteamusermappingcreatetime: Date.now(),
          eteamusermappingcreateby: 3,
          eteamusermappingchangetime: Date.now(),
          eteamusermappingchangeby: 3
        },
        {
          eteameteamid: 3,
          eusereuserid: 3,
          eteamusermappingposition: 'MEMBER',
          eteamusermappingcreatetime: Date.now(),
          eteamusermappingcreateby: 1,
          eteamusermappingchangetime: Date.now(),
          eteamusermappingchangeby: 1
        },
    ]
  ));
