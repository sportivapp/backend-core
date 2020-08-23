exports.seed = (knex, Promise) => knex('emodule').del()
  .then(() =>
    knex('emodule').insert(
      [
        {
          emoduleid: 1,
          emodulename: 'Company'
        },
        {
          emoduleid: 2,
          emodulename: 'Branch'
        },
        {
          emoduleid: 3,
          emodulename: 'Department'
        },
        {
          emoduleid: 4,
          emodulename: 'Position'
        },
        {
          emoduleid: 5,
          emodulename: 'Employee'
        },
        {
          emoduleid: 6,
          emodulename: 'Absence'
        },
        {
          emoduleid: 7,
          emodulename: 'Attendance'
        },
        {
          emoduleid: 8,
          emodulename: 'Shift'
        },
        {
          emoduleid: 9,
          emodulename: 'Timesheet'
        },
        {
          emoduleid: 10,
          emodulename: 'Project'
        },
        {
          emoduleid: 11,
          emodulename: 'Announcement'
        },
        {
          emoduleid: 12,
          emodulename: 'Report'
        },
        {
          emoduleid: 13,
          emodulename: 'Setting'
        },
      ]
    ));