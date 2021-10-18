exports.seed = (knex, Promise) => knex('ecompanymodulemapping').del()
  .then(() =>
    knex('ecompanymodulemapping').insert(
      [
        {
          ecompanymodulemappingname: 'Company',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 1,
        },
        {
          ecompanymodulemappingname: 'Branch',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 2,
        },
        {
          ecompanymodulemappingname: 'Department',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 3,
        },
        {
          ecompanymodulemappingname: 'Position',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 4,
        },
        {
          ecompanymodulemappingname: 'Employee',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 5,
        },
        {
          ecompanymodulemappingname: 'Shift',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 6,
        },
        {
          ecompanymodulemappingname: 'Timesheet',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 7,
        },
        {
          ecompanymodulemappingname: 'Reporting',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 8,
        },
        {
          ecompanymodulemappingname: 'Setting',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 9,
        },
        {
          ecompanymodulemappingname: 'Class',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 10,
        },
        {
          ecompanymodulemappingname: 'Team',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 11,
        },
        {
          ecompanymodulemappingname: 'Theory',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 12,
        },
        {
          ecompanymodulemappingname: 'Forum',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 13,
        },
        {
          ecompanymodulemappingname: 'News',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 14,
        },
        {
          ecompanymodulemappingname: 'Tournament',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 15,
        },
        {
          ecompanymodulemappingname: 'Bank',
          ecompanyecompanyid: 1,
          emoduleemoduleid: 16,
        },
      ]
    ));