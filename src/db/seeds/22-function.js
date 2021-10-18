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
                  efunctionname: 'Create Shift'
                },
                {
                  
                  efunctioncode: 'R6',
                  efunctionname: 'Read Shift'
                },
                {
                  
                  efunctioncode: 'U6',
                  efunctionname: 'Update Shift'
                },
                {
                  
                  efunctioncode: 'D6',
                  efunctionname: 'Delete Shift'
                },
                {
                  
                  efunctioncode: 'C7',
                  efunctionname: 'Create Timesheet'
                },
                {
                  
                  efunctioncode: 'R7',
                  efunctionname: 'Read Timesheet'
                },
                {
                  
                  efunctioncode: 'U7',
                  efunctionname: 'Update Timesheet'
                },
                {
                  
                  efunctioncode: 'D7',
                  efunctionname: 'Delete Timesheet'
                },
                {
                  
                  efunctioncode: 'C8',
                  efunctionname: 'Create Report'
                },
                {
                  
                  efunctioncode: 'R8',
                  efunctionname: 'Read Report'
                },
                {
                  
                  efunctioncode: 'U8',
                  efunctionname: 'Update Report'
                },
                {
                  
                  efunctioncode: 'D8',
                  efunctionname: 'Delete Report'
                },
                {
                  
                  efunctioncode: 'C9',
                  efunctionname: 'Create Setting'
                },
                {
                  
                  efunctioncode: 'R9',
                  efunctionname: 'Read Setting'
                },
                {
                  
                  efunctioncode: 'U9',
                  efunctionname: 'Update Setting'
                },
                {
                  
                  efunctioncode: 'D9',
                  efunctionname: 'Delete Setting'
                },
                {
                  
                  efunctioncode: 'C10',
                  efunctionname: 'Create Class'
                },
                {
                  
                  efunctioncode: 'R10',
                  efunctionname: 'Read Class'
                },
                {
                  
                  efunctioncode: 'U10',
                  efunctionname: 'Update Class'
                },
                {
                  
                  efunctioncode: 'D10',
                  efunctionname: 'Delete Class'
                },
                {
                  
                  efunctioncode: 'C11',
                  efunctionname: 'Create Team'
                },
                {
                  
                  efunctioncode: 'R11',
                  efunctionname: 'Read Team'
                },
                {
                  
                  efunctioncode: 'U11',
                  efunctionname: 'Update Team'
                },
                {
                  
                  efunctioncode: 'D11',
                  efunctionname: 'Delete Team'
                },
                {
                  
                  efunctioncode: 'C12',
                  efunctionname: 'Create Theory'
                },
                {
                  
                  efunctioncode: 'R12',
                  efunctionname: 'Read Theory'
                },
                {
                  
                  efunctioncode: 'U12',
                  efunctionname: 'Update Theory'
                },
                {
                  
                  efunctioncode: 'D12',
                  efunctionname: 'Delete Theory'
                },
                {
                  efunctioncode: 'P13',
                  efunctionname: 'Set Public Status Forum'
                },
                {
                  efunctioncode: 'D13',
                  efunctionname: 'Delete Forum'
                },
                {
                  
                  efunctioncode: 'C14',
                  efunctionname: 'Create News'
                },
                {
                  
                  efunctioncode: 'R14',
                  efunctionname: 'Read News'
                },
                {
                  
                  efunctioncode: 'U14',
                  efunctionname: 'Update News'
                },
                {
                  
                  efunctioncode: 'D14',
                  efunctionname: 'Delete News'
                },
                {
                  
                  efunctioncode: 'C15',
                  efunctionname: 'Create Tournament'
                },
                {
                  
                  efunctioncode: 'R15',
                  efunctionname: 'Read Tournament'
                },
                {
                  
                  efunctioncode: 'U15',
                  efunctionname: 'Update Tournament'
                },
                {
                  
                  efunctioncode: 'D15',
                  efunctionname: 'Delete Tournament'
                },
                {
                  
                  efunctioncode: 'C16',
                  efunctionname: 'Create Bank'
                },
                {
                  
                  efunctioncode: 'R16',
                  efunctionname: 'Read Bank'
                },
                {
                  
                  efunctioncode: 'U16',
                  efunctionname: 'Update Bank'
                },
                {
                  
                  efunctioncode: 'D16',
                  efunctionname: 'Delete Bank'
                },
            ]
        ));
