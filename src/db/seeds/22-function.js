exports.seed = (knex, Promise) => knex('efunction').del()
    .then(() =>
        knex('efunction').insert(
            [
                {
                  efunctionefunctionid: 1,
                  efunctioncode: 'C1',
                  efunctionname: 'Create Company'
                },
                {
                  efunctionefunctionid: 2,
                  efunctioncode: 'R1',
                  efunctionname: 'Read Company'
                },
                {
                  efunctionefunctionid: 3,
                  efunctioncode: 'U1',
                  efunctionname: 'Update Company'
                },
                {
                  efunctionefunctionid: 4,
                  efunctioncode: 'D1',
                  efunctionname: 'Delete Company'
                },
                {
                  efunctionefunctionid: 5,
                  efunctioncode: 'C2',
                  efunctionname: 'Create Branch'
                },
                {
                  efunctionefunctionid: 6,
                  efunctioncode: 'R2',
                  efunctionname: 'Read Branch'
                },
                {
                  efunctionefunctionid: 7,
                  efunctioncode: 'U2',
                  efunctionname: 'Update Branch'
                },
                {
                  efunctionefunctionid: 8,
                  efunctioncode: 'D2',
                  efunctionname: 'Delete Branch'
                },
                {
                  efunctionefunctionid: 9,
                  efunctioncode: 'C3',
                  efunctionname: 'Create Department'
                },
                {
                  efunctionefunctionid: 10,
                  efunctioncode: 'R3',
                  efunctionname: 'Read Department'
                },
                {
                  efunctionefunctionid: 11,
                  efunctioncode: 'U3',
                  efunctionname: 'Update Department'
                },
                {
                  efunctionefunctionid: 12,
                  efunctioncode: 'D3',
                  efunctionname: 'Delete Department'
                },
                {
                  efunctionefunctionid: 13,
                  efunctioncode: 'C4',
                  efunctionname: 'Create Position'
                },
                {
                  efunctionefunctionid: 14,
                  efunctioncode: 'R4',
                  efunctionname: 'Read Position'
                },
                {
                  efunctionefunctionid: 15,
                  efunctioncode: 'U4',
                  efunctionname: 'Update Position'
                },
                {
                  efunctionefunctionid: 16,
                  efunctioncode: 'D4',
                  efunctionname: 'Delete Position'
                },
                {
                  efunctionefunctionid: 17,
                  efunctioncode: 'C5',
                  efunctionname: 'Create Employee'
                },
                {
                  efunctionefunctionid: 18,
                  efunctioncode: 'R5',
                  efunctionname: 'Read Employee'
                },
                {
                  efunctionefunctionid: 19,
                  efunctioncode: 'U5',
                  efunctionname: 'Update Employee'
                },
                {
                  efunctionefunctionid: 20,
                  efunctioncode: 'D5',
                  efunctionname: 'Delete Employee'
                },
                {
                  efunctionefunctionid: 17,
                  efunctioncode: 'C5',
                  efunctionname: 'Create Employee'
                },
                {
                  efunctionefunctionid: 18,
                  efunctioncode: 'R5',
                  efunctionname: 'Read Employee'
                },
                {
                  efunctionefunctionid: 19,
                  efunctioncode: 'U5',
                  efunctionname: 'Update Employee'
                },
                {
                  efunctionefunctionid: 20,
                  efunctioncode: 'D5',
                  efunctionname: 'Delete Employee'
                },
                {
                  efunctionefunctionid: 21,
                  efunctioncode: 'C6',
                  efunctionname: 'Create Absence'
                },
                {
                  efunctionefunctionid: 22,
                  efunctioncode: 'R6',
                  efunctionname: 'Read Absence'
                },
                {
                  efunctionefunctionid: 23,
                  efunctioncode: 'U6',
                  efunctionname: 'Update Absence'
                },
                {
                  efunctionefunctionid: 24,
                  efunctioncode: 'D6',
                  efunctionname: 'Delete Absence'
                },
                {
                  efunctionefunctionid: 25,
                  efunctioncode: 'C7',
                  efunctionname: 'Create Attendance'
                },
                {
                  efunctionefunctionid: 26,
                  efunctioncode: 'R7',
                  efunctionname: 'Read Attendance'
                },
                {
                  efunctionefunctionid: 27,
                  efunctioncode: 'U7',
                  efunctionname: 'Update Attendance'
                },
                {
                  efunctionefunctionid: 28,
                  efunctioncode: 'D7',
                  efunctionname: 'Delete Attendance'
                },
                {
                  efunctionefunctionid: 29,
                  efunctioncode: 'C8',
                  efunctionname: 'Create Shift'
                },
                {
                  efunctionefunctionid: 30,
                  efunctioncode: 'R8',
                  efunctionname: 'Read Shift'
                },
                {
                  efunctionefunctionid: 31,
                  efunctioncode: 'U8',
                  efunctionname: 'Update Shift'
                },
                {
                  efunctionefunctionid: 32,
                  efunctioncode: 'D8',
                  efunctionname: 'Delete Shift'
                },
                {
                  efunctionefunctionid: 33,
                  efunctioncode: 'C9',
                  efunctionname: 'Create Timesheet'
                },
                {
                  efunctionefunctionid: 34,
                  efunctioncode: 'R9',
                  efunctionname: 'Read Timesheet'
                },
                {
                  efunctionefunctionid: 35,
                  efunctioncode: 'U9',
                  efunctionname: 'Update Timesheet'
                },
                {
                  efunctionefunctionid: 36,
                  efunctioncode: 'D9',
                  efunctionname: 'Delete Timesheet'
                },
                {
                  efunctionefunctionid: 37,
                  efunctioncode: 'C10',
                  efunctionname: 'Create Project'
                },
                {
                  efunctionefunctionid: 38,
                  efunctioncode: 'R10',
                  efunctionname: 'Read Project'
                },
                {
                  efunctionefunctionid: 39,
                  efunctioncode: 'U10',
                  efunctionname: 'Update Project'
                },
                {
                  efunctionefunctionid: 40,
                  efunctioncode: 'D10',
                  efunctionname: 'Delete Project'
                },
                {
                  efunctionefunctionid: 41,
                  efunctioncode: 'C11',
                  efunctionname: 'Create Announcement'
                },
                {
                  efunctionefunctionid: 42,
                  efunctioncode: 'R11',
                  efunctionname: 'Read Announcement'
                },
                {
                  efunctionefunctionid: 43,
                  efunctioncode: 'U11',
                  efunctionname: 'Update Announcement'
                },
                {
                  efunctionefunctionid: 44,
                  efunctioncode: 'D11',
                  efunctionname: 'Delete Announcement'
                },
                {
                  efunctionefunctionid: 45,
                  efunctioncode: 'C12',
                  efunctionname: 'Create Report'
                },
                {
                  efunctionefunctionid: 46,
                  efunctioncode: 'R12',
                  efunctionname: 'Read Report'
                },
                {
                  efunctionefunctionid: 47,
                  efunctioncode: 'U12',
                  efunctionname: 'Update Report'
                },
                {
                  efunctionefunctionid: 48,
                  efunctioncode: 'D12',
                  efunctionname: 'Delete Report'
                },
                {
                  efunctionefunctionid: 49,
                  efunctioncode: 'C13',
                  efunctionname: 'Create Setting'
                },
                {
                  efunctionefunctionid: 50,
                  efunctioncode: 'R13',
                  efunctionname: 'Read Setting'
                },
                {
                  efunctionefunctionid: 51,
                  efunctioncode: 'U13',
                  efunctionname: 'Update Setting'
                },
                {
                  efunctionefunctionid: 52,
                  efunctioncode: 'D13',
                  efunctionname: 'Delete Setting'
                },
            ]
        ));
