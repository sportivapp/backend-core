exports.seed = (knex, Promise) => knex('ecompanycarouselmapping').del()
.then(() =>
  knex('ecompanycarouselmapping').insert(
    [
        {
          ecompanyecompanyid: 6,
          efileefileid: 3,
          ecompanycarouselmappingcreatetime: Date.now(),
          ecompanycarouselmappingcreateby: 0,
          ecompanycarouselmappingchangetime: Date.now(),
          ecompanycarouselmappingchangeby: 0
        },
    ]
  ));
