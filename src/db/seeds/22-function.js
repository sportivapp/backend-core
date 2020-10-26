exports.seed = (knex, Promise) => knex('efunction').del()
    .then(() =>
        knex('efunction').insert(
            [
                {
                  
                  efunctioncode: 'C1',
                  efunctionname: 'Create Company'
                },
                {
                  
                  efunctioncode: 'R1',
                  efunctionname: 'Read Company'
                },
                {
                  
                  efunctioncode: 'U1',
                  efunctionname: 'Update Company'
                },
                {
                  
                  efunctioncode: 'D1',
                  efunctionname: 'Delete Company'
                },
                {
                  
                  efunctioncode: 'C2',
                  efunctionname: 'Create Branch'
                },
                {
                  
                  efunctioncode: 'R2',
                  efunctionname: 'Read Branch'
                },
                {
                  
                  efunctioncode: 'U2',
                  efunctionname: 'Update Branch'
                },
                {
                  
                  efunctioncode: 'D2',
                  efunctionname: 'Delete Branch'
                },
                {
                  
                  efunctioncode: 'C3',
                  efunctionname: 'Create Department'
                },
                {
                  
                  efunctioncode: 'R3',
                  efunctionname: 'Read Department'
                },
                {
                  
                  efunctioncode: 'U3',
                  efunctionname: 'Update Department'
                },
                {
                  
                  efunctioncode: 'D3',
                  efunctionname: 'Delete Department'
                },
                {
                  
                  efunctioncode: 'C4',
                  efunctionname: 'Create Position'
                },
                {
                  
                  efunctioncode: 'R4',
                  efunctionname: 'Read Position'
                },
                {
                  
                  efunctioncode: 'U4',
                  efunctionname: 'Update Position'
                },
                {
                  
                  efunctioncode: 'D4',
                  efunctionname: 'Delete Position'
                },
                {
                  
                  efunctioncode: 'C5',
                  efunctionname: 'Create Employee'
                },
                {
                  
                  efunctioncode: 'R5',
                  efunctionname: 'Read Employee'
                },
                {
                  
                  efunctioncode: 'U5',
                  efunctionname: 'Update Employee'
                },
                {
                  
                  efunctioncode: 'D5',
                  efunctionname: 'Delete Employee'
                },
                {
                  
                  efunctioncode: 'C6',
                  efunctionname: 'Create Absence'
                },
                {
                  
                  efunctioncode: 'R6',
                  efunctionname: 'Read Absence'
                },
                {
                  
                  efunctioncode: 'U6',
                  efunctionname: 'Update Absence'
                },
                {
                  
                  efunctioncode: 'D6',
                  efunctionname: 'Delete Absence'
                },
                {
                  
                  efunctioncode: 'C7',
                  efunctionname: 'Create Attendance'
                },
                {
                  
                  efunctioncode: 'R7',
                  efunctionname: 'Read Attendance'
                },
                {
                  
                  efunctioncode: 'U7',
                  efunctionname: 'Update Attendance'
                },
                {
                  
                  efunctioncode: 'D7',
                  efunctionname: 'Delete Attendance'
                },
                {
                  
                  efunctioncode: 'C8',
                  efunctionname: 'Create Shift'
                },
                {
                  
                  efunctioncode: 'R8',
                  efunctionname: 'Read Shift'
                },
                {
                  
                  efunctioncode: 'U8',
                  efunctionname: 'Update Shift'
                },
                {
                  
                  efunctioncode: 'D8',
                  efunctionname: 'Delete Shift'
                },
                {
                  
                  efunctioncode: 'C9',
                  efunctionname: 'Create Timesheet'
                },
                {
                  
                  efunctioncode: 'R9',
                  efunctionname: 'Read Timesheet'
                },
                {
                  
                  efunctioncode: 'U9',
                  efunctionname: 'Update Timesheet'
                },
                {
                  
                  efunctioncode: 'D9',
                  efunctionname: 'Delete Timesheet'
                },
                {
                  
                  efunctioncode: 'C10',
                  efunctionname: 'Create Project'
                },
                {
                  
                  efunctioncode: 'R10',
                  efunctionname: 'Read Project'
                },
                {
                  
                  efunctioncode: 'U10',
                  efunctionname: 'Update Project'
                },
                {
                  
                  efunctioncode: 'D10',
                  efunctionname: 'Delete Project'
                },
                {
                  
                  efunctioncode: 'C11',
                  efunctionname: 'Create Announcement'
                },
                {
                  
                  efunctioncode: 'R11',
                  efunctionname: 'Read Announcement'
                },
                {
                  
                  efunctioncode: 'U11',
                  efunctionname: 'Update Announcement'
                },
                {
                  
                  efunctioncode: 'D11',
                  efunctionname: 'Delete Announcement'
                },
                {
                  
                  efunctioncode: 'C12',
                  efunctionname: 'Create Report'
                },
                {
                  
                  efunctioncode: 'R12',
                  efunctionname: 'Read Report'
                },
                {
                  
                  efunctioncode: 'U12',
                  efunctionname: 'Update Report'
                },
                {
                  
                  efunctioncode: 'D12',
                  efunctionname: 'Delete Report'
                },
                {
                  
                  efunctioncode: 'C13',
                  efunctionname: 'Create Setting'
                },
                {
                  
                  efunctioncode: 'R13',
                  efunctionname: 'Read Setting'
                },
                {
                  
                  efunctioncode: 'U13',
                  efunctionname: 'Update Setting'
                },
                {
                  
                  efunctioncode: 'D13',
                  efunctionname: 'Delete Setting'
                },
            ]
        ));
