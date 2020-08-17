exports.seed = (knex) => knex('egrade').del()
    .then(() =>
        knex('egrade').insert(
            [
                {
                    egradedescription: 'Head Department',
                    egradename: 'Head Sales Department',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    edepartmentedepartmentid: 1,
                    egradecreatetime: Date.now()
                },
                {
                    egradedescription: 'Head Department',
                    egradename: 'Head Department of IT',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    edepartmentedepartmentid: 2,
                    egradecreatetime: Date.now()
                },
                {
                    egradedescription: 'Manager',
                    egradename: 'Manager of Sales',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 1,
                    edepartmentedepartmentid: 1,
                    egradecreatetime: Date.now()
                },
                {
                    egradedescription: 'Manager',
                    egradename: 'Manager of IT',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 2,
                    edepartmentedepartmentid: 2,
                    egradecreatetime: Date.now()
                },
                {
                    egradedescription: 'Head Department',
                    egradename: 'Head Sales Department',
                    ecompanyecompanyid: 2,
                    egradecreateby: 1,
                    edepartmentedepartmentid: 6,
                    egradecreatetime: Date.now()
                },
                {
                    egradedescription: '',
                    egradename: 'DEFAULT DEPARTMENT OWNER',
                    ecompanyecompanyid: 4,
                    edepartmentedepartmentid: 7,
                    egradecreateby: 7,
                    egradecreatetime: Date.now()
                },
                {
                    egradedescription: 'Ketua APSSI',
                    egradename: '',
                    ecompanyecompanyid: 4,
                    edepartmentedepartmentid: 7,
                    egradecreateby: 7,
                    egradecreatetime: Date.now()
                },
            ]
        ));