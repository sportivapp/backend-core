exports.seed = (knex) => knex('edepartment').del()
    .then(() =>
        knex('edepartment').insert(
            [
                {
                    edepartmentname: 'Sales Department',
                    edepartmentdescription: 'Consist of Sales',
                    edepartmentcreateby: 1,
                    ecompanyecompanyid: 1,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'IT Department',
                    edepartmentdescription: 'Consist of ITs',
                    edepartmentcreateby: 1,
                    ecompanyecompanyid: 1,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'Sub Sales Department T1',
                    edepartmentdescription: 'Consist of Sub Sales T1',
                    edepartmentcreateby: 1,
                    edepartmentsuperiorid: 1,
                    ecompanyecompanyid: 1,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'Sub IT Department T1',
                    edepartmentdescription: 'Consist of Sub IT T1',
                    edepartmentcreateby: 1,
                    edepartmentsuperiorid: 2,
                    ecompanyecompanyid: 1,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'IT Department',
                    edepartmentdescription: 'Consist of ITs',
                    edepartmentcreateby: 1,
                    ecompanyecompanyid: 2,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'Sub Sales Department T1',
                    edepartmentdescription: 'Consist of Sub Sales T1',
                    edepartmentcreateby: 1,
                    edepartmentsuperiorid: 5,
                    ecompanyecompanyid: 2,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'Finance',
                    edepartmentdescription: 'Mengatur keuangan',
                    edepartmentcreateby: 7,
                    ecompanyecompanyid: 4,
                    edepartmentcreatetime: Date.now()
                },
                {
                    edepartmentname: 'Finance (BRANCH)',
                    edepartmentdescription: 'Mengatur keuangan',
                    edepartmentcreateby: 7,
                    ecompanyecompanyid: 5,
                    edepartmentcreatetime: Date.now()
                },
            ]
        ));