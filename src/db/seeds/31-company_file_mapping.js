exports.seed = (knex, Promise) => knex('ecompanyfilemapping').del()
.then(() =>
  knex('ecompanyfilemapping').insert(
    [
        {
            ecompanyecompanyid: 1,
            efileefileid: 2,
            ecompanyfilemappingcreatetime: Date.now(),
            ecompanyfilemappingcreateby: 1,
            ecompanyfilemappingchangetime: Date.now(),
            ecompanyfilemappingchangeby: 1
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 3,
          ecompanyfilemappingcreatetime: Date.now(),
          ecompanyfilemappingcreateby: 1,
          ecompanyfilemappingchangetime: Date.now(),
          ecompanyfilemappingchangeby: 1
        },
    ]
  ));
