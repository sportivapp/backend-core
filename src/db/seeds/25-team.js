exports.seed = (knex, Promise) => knex('eteam').del()
.then(() =>
  knex('eteam').insert(
    [
        {
            ecompanyecompanyid: 1,
            efileefileid: 1,
            eteamname: 'Basketball on Fire',
            eteamdescription: 'Basketball is our spirit',
            eindustryeindustryid: 1,
            eteamispublic: true,
            eteamcreatetime: Date.now(),
            eteamcreateby: 1,
            eteamchangetime: Date.now(),
            eteamchangeby: 1
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 1,
          eteamname: 'Badminton Rocket',
          eteamdescription: 'We train like a rocket',
          eindustryeindustryid: 1,
          eteamispublic: false,
          eteamcreatetime: Date.now(),
          eteamcreateby: 1,
          eteamchangetime: Date.now(),
          eteamchangeby: 1
        },
        {
          ecompanyecompanyid: 1,
          efileefileid: 1,
          eteamname: 'Soccer Spirit',
          eteamdescription: 'We Play Soccer Together as a team',
          eindustryeindustryid: 1,
          eteamispublic: false,
          eteamcreatetime: Date.now(),
          eteamcreateby: 1,
          eteamchangetime: Date.now(),
          eteamchangeby: 1
        },
    ]
  ));
