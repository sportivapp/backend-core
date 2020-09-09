exports.seed = (knex, Promise) => knex('enews').del()
.then(() =>
  knex('enews').insert(
    [
        {
            enewsdate: 655516800,
            enewstitle: 'Title',
            enewscontent: 'Content',
            enewscreatetime: Date.now(),
            enewscreateby: 1,
            enewschangetime: Date.now(),
            enewschangeby: 1,
            efileefileid: 1,
            ecompanyecompanyid: 1
        }
    ]
  ));
