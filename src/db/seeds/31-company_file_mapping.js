exports.seed = (knex, Promise) => knex('ecompanyfilemapping').del()
.then(() =>
  knex('ecompanyfilemapping').insert(
    [
        {
            ecompanyecompanyid: 1,
            efileefileid: 4,
            ecompanyfilemappingcreatetime: Date.now(),
            ecompanyfilemappingcreateby: 0,
            ecompanyfilemappingchangetime: Date.now(),
            ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 5,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 6,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 7,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 8,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 9,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 10,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 11,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 12,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 13,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 0,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 0
        },
    ]
  ));
