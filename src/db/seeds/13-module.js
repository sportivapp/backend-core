exports.seed = (knex, Promise) => knex('emodule').del()
  .then(() =>
    knex('emodule').insert(
      [
        {
          emodulename: 'Company'
        },
        {
          emodulename: 'Branch'
        },
        {
          emodulename: 'Department'
        },
        {
          emodulename: 'Position'
        },
        {
          emodulename: 'Employee'
        },
        {
          emodulename: 'Shift'
        },
        {
          emodulename: 'Timesheet'
        },
        {
          emodulename: 'Reporting'
        },
        {
          emodulename: 'Setting'
        },
      ]
    ));