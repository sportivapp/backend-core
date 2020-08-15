exports.seed = (knex) => knex('egrade').del()
    .then(() =>
        knex('egrade').insert(
            [
                {
                    egradedescription: 'Head Department',
                    egradename: 'Head Sales Department',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    edepartmentedepartmentid: 1
                },
                {
                    egradedescription: 'Head Department',
                    egradename: 'Head Department of IT',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    edepartmentedepartmentid: 2
                },
                {
                    egradedescription: 'Manager',
                    egradename: 'Manager of Sales',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 1,
                    edepartmentedepartmentid: 1
                },
                {
                    egradedescription: 'Manager',
                    egradename: 'Manager of IT',
                    ecompanyecompanyid: 1,
                    egradecreateby: 1,
                    egradesuperiorid: 2,
                    edepartmentedepartmentid: 2
                }
            ]
        ));