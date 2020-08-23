exports.seed = (knex, Promise) => knex('efunction').del()
    .then(() =>
        knex('efunction').insert(
            [
                {
                  efunctionid: 1,
                  efunctioncode: 'C1',
                  efunctionname: 'Create Company'
                },
                {
                  efunctionid: 2,
                  efunctioncode: 'R1',
                  efunctionname: 'Read Company'
                },
                {
                  efunctionid: 3,
                  efunctioncode: 'U1',
                  efunctionname: 'Update Company'
                },
                {
                  efunctionid: 4,
                  efunctioncode: 'D1',
                  efunctionname: 'Delete Company'
                },
                {
                  efunctionid: 5,
                  efunctioncode: 'C2',
                  efunctionname: 'Create Branch'
                },
                {
                  efunctionid: 6,
                  efunctioncode: 'R2',
                  efunctionname: 'Read Branch'
                },
                {
                  efunctionid: 7,
                  efunctioncode: 'U2',
                  efunctionname: 'Update Branch'
                },
                {
                  efunctionid: 8,
                  efunctioncode: 'D2',
                  efunctionname: 'Delete Branch'
                },
                {
                  efunctionid: 9,
                  efunctioncode: 'C3',
                  efunctionname: 'Create Department'
                },
                {
                  efunctionid: 10,
                  efunctioncode: 'R3',
                  efunctionname: 'Read Department'
                },
                {
                  efunctionid: 11,
                  efunctioncode: 'U3',
                  efunctionname: 'Update Department'
                },
                {
                  efunctionid: 12,
                  efunctioncode: 'D3',
                  efunctionname: 'Delete Department'
                },
                {
                  efunctionid: 13,
                  efunctioncode: 'C4',
                  efunctionname: 'Create Position'
                },
                {
                  efunctionid: 14,
                  efunctioncode: 'R4',
                  efunctionname: 'Read Position'
                },
                {
                  efunctionid: 15,
                  efunctioncode: 'U4',
                  efunctionname: 'Update Position'
                },
                {
                  efunctionid: 16,
                  efunctioncode: 'D4',
                  efunctionname: 'Delete Position'
                },
                {
                  efunctionid: 17,
                  efunctioncode: 'C5',
                  efunctionname: 'Create Employee'
                },
                {
                  efunctionid: 18,
                  efunctioncode: 'R5',
                  efunctionname: 'Read Employee'
                },
                {
                  efunctionid: 19,
                  efunctioncode: 'U5',
                  efunctionname: 'Update Employee'
                },
                {
                  efunctionid: 20,
                  efunctioncode: 'D5',
                  efunctionname: 'Delete Employee'
                },
                {
                  efunctionid: 21,
                  efunctioncode: 'C6',
                  efunctionname: 'Create Absence'
                },
                {
                  efunctionid: 22,
                  efunctioncode: 'R6',
                  efunctionname: 'Read Absence'
                },
                {
                  efunctionid: 23,
                  efunctioncode: 'U6',
                  efunctionname: 'Update Absence'
                },
                {
                  efunctionid: 24,
                  efunctioncode: 'D6',
                  efunctionname: 'Delete Absence'
                },
                {
                  efunctionid: 25,
                  efunctioncode: 'C7',
                  efunctionname: 'Create Attendance'
                },
                {
                  efunctionid: 26,
                  efunctioncode: 'R7',
                  efunctionname: 'Read Attendance'
                },
                {
                  efunctionid: 27,
                  efunctioncode: 'U7',
                  efunctionname: 'Update Attendance'
                },
                {
                  efunctionid: 28,
                  efunctioncode: 'D7',
                  efunctionname: 'Delete Attendance'
                },
                {
                  efunctionid: 29,
                  efunctioncode: 'C8',
                  efunctionname: 'Create Shift'
                },
                {
                  efunctionid: 30,
                  efunctioncode: 'R8',
                  efunctionname: 'Read Shift'
                },
                {
                  efunctionid: 31,
                  efunctioncode: 'U8',
                  efunctionname: 'Update Shift'
                },
                {
                  efunctionid: 32,
                  efunctioncode: 'D8',
                  efunctionname: 'Delete Shift'
                },
                {
                  efunctionid: 33,
                  efunctioncode: 'C9',
                  efunctionname: 'Create Timesheet'
                },
                {
                  efunctionid: 34,
                  efunctioncode: 'R9',
                  efunctionname: 'Read Timesheet'
                },
                {
                  efunctionid: 35,
                  efunctioncode: 'U9',
                  efunctionname: 'Update Timesheet'
                },
                {
                  efunctionid: 36,
                  efunctioncode: 'D9',
                  efunctionname: 'Delete Timesheet'
                },
                {
                  efunctionid: 37,
                  efunctioncode: 'C10',
                  efunctionname: 'Create Project'
                },
                {
                  efunctionid: 38,
                  efunctioncode: 'R10',
                  efunctionname: 'Read Project'
                },
                {
                  efunctionid: 39,
                  efunctioncode: 'U10',
                  efunctionname: 'Update Project'
                },
                {
                  efunctionid: 40,
                  efunctioncode: 'D10',
                  efunctionname: 'Delete Project'
                },
                {
                  efunctionid: 41,
                  efunctioncode: 'C11',
                  efunctionname: 'Create Announcement'
                },
                {
                  efunctionid: 42,
                  efunctioncode: 'R11',
                  efunctionname: 'Read Announcement'
                },
                {
                  efunctionid: 43,
                  efunctioncode: 'U11',
                  efunctionname: 'Update Announcement'
                },
                {
                  efunctionid: 44,
                  efunctioncode: 'D11',
                  efunctionname: 'Delete Announcement'
                },
                {
                  efunctionid: 45,
                  efunctioncode: 'C12',
                  efunctionname: 'Create Report'
                },
                {
                  efunctionid: 46,
                  efunctioncode: 'R12',
                  efunctionname: 'Read Report'
                },
                {
                  efunctionid: 47,
                  efunctioncode: 'U12',
                  efunctionname: 'Update Report'
                },
                {
                  efunctionid: 48,
                  efunctioncode: 'D12',
                  efunctionname: 'Delete Report'
                },
                {
                  efunctionid: 49,
                  efunctioncode: 'C13',
                  efunctionname: 'Create Setting'
                },
                {
                  efunctionid: 50,
                  efunctioncode: 'R13',
                  efunctionname: 'Read Setting'
                },
                {
                  efunctionid: 51,
                  efunctioncode: 'U13',
                  efunctionname: 'Update Setting'
                },
                {
                  efunctionid: 52,
                  efunctioncode: 'D13',
                  efunctionname: 'Delete Setting'
                },
            ]
        ));
