exports.seed = (knex, Promise) => knex('emodule').del()
  .then(() =>
    knex('emodule').insert(
      [
        {
          emoduleemoduleid: 1,
          emodulename: 'Company'
        },
        {
          emoduleemoduleid: 2,
          emodulename: 'Branch'
        },
        {
          emoduleemoduleid: 3,
          emodulename: 'Department'
        },
        {
          emoduleemoduleid: 4,
          emodulename: 'Position'
        },
        {
          emoduleemoduleid: 5,
          emodulename: 'Employee'
        },
        {
          emoduleemoduleid: 6,
          emodulename: 'Absence'
        },
        {
          emoduleemoduleid: 7,
          emodulename: 'Attendance'
        },
        {
          emoduleemoduleid: 8,
          emodulename: 'Shift'
        },
        {
          emoduleemoduleid: 9,
          emodulename: 'Timesheet'
        },
        {
          emoduleemoduleid: 10,
          emodulename: 'Project'
        },
        {
          emoduleemoduleid: 11,
          emodulename: 'Announcement'
        },
        {
          emoduleemoduleid: 12,
          emodulename: 'Report'
        },
        {
          emoduleemoduleid: 13,
          emodulename: 'Setting'
        },
      ]
    ));