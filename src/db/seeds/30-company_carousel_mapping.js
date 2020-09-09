exports.seed = (knex, Promise) => knex('ecompanycarouselmapping').del()
.then(() =>
  knex('ecompanycarouselmapping').insert(
    [
        {
            ecompanyecompanyid: 1,
            efileefileid: 2,
            ecompanycarouselmappingcreatetime: Date.now(),
            ecompanycarouselmappingcreateby: 1,
            ecompanycarouselmappingchangetime: Date.now(),
            ecompanycarouselmappingchangeby: 1
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 3,
          ecompanycarouselmappingcreatetime: Date.now(),
          ecompanycarouselmappingcreateby: 1,
          ecompanycarouselmappingchangetime: Date.now(),
          ecompanycarouselmappingchangeby: 1
        },
    ]
  ));
