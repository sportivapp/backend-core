exports.seed = (knex) => knex('edepartment').del()
    .then(() =>
        knex('edepartment').insert(
            [
                {
                  edepartmentname: 'Sales Department',
                  edepartmentdescription: 'Consist of Sales',
                  edepartmentcreateby: 1,
                  ecompanyecompanyid: 1
                },
                {
                  edepartmentname: 'IT Department',
                  edepartmentdescription: 'Consist of ITs',
                  edepartmentcreateby: 1,
                  ecompanyecompanyid: 1
                },
                {
                  edepartmentname: 'Sub Sales Department T1',
                  edepartmentdescription: 'Consist of Sub Sales T1',
                  edepartmentcreateby: 1,
                  edepartmentsuperiorid: 1,
                  ecompanyecompanyid: 1
                },
                {
                  edepartmentname: 'Sub IT Department T1',
                  edepartmentdescription: 'Consist of Sub IT T1',
                  edepartmentcreateby: 1,
                  edepartmentsuperiorid: 2,
                  ecompanyecompanyid: 1
                },
            ]
        ));