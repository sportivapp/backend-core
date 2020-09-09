exports.seed = (knex, Promise) => knex('eteamindustrymapping').del()
.then(() =>
  knex('eteamindustrymapping').insert(
    [
        {
            eteameteamid: 1,
            eindustryeindustryid: 3,
            eteamindustrymappingcreatetime: Date.now(),
            eteamindustrymappingcreateby: 1,
            eteamindustrymappingchangetime: Date.now(),
            eteamindustrymappingchangeby: 1
        },
        {
          eteameteamid: 2,
          eindustryeindustryid: 4,
          eteamindustrymappingcreatetime: Date.now(),
          eteamindustrymappingcreateby: 1,
          eteamindustrymappingchangetime: Date.now(),
          eteamindustrymappingchangeby: 1
        },
        {
          eteameteamid: 3,
          eindustryeindustryid: 1,
          eteamindustrymappingcreatetime: Date.now(),
          eteamindustrymappingcreateby: 1,
          eteamindustrymappingchangetime: Date.now(),
          eteamindustrymappingchangeby: 1
        },
    ]
  ));
