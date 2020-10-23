exports.up = (knex, _) => knex.transaction(trx => {
    knex('ecompany')
        .then(companies => {
            const mappings = []
            companies.forEach(company => {
            
                const adminGrade = {
                    egradename: 'Administrator',
                    egradedescription: 'Administrator of Company',
                    ecompanyecompanyid: company.ecompanyid,
                    egradecreateby: company.ecompanycreateby,
                    egradecreatetime: Date.now()
                }

                const memberGrade = {
                    egradename: 'Member',
                    egradedescription: 'Member of Company',
                    ecompanyecompanyid: company.ecompanyid,
                    egradecreateby: company.ecompanycreateby,
                    egradecreatetime: Date.now()
                }

                mappings.push(adminGrade)
                mappings.push(memberGrade)

            })

            const addGrades = knex('egrade')
            .insert(mappings)
            .transacting(trx)

            return Promise.all(addGrades)
            .then(grades => {

                let defaultPositions = []
                
                companies.forEach(company => {
                    const newGrades = grades.filter(grade => grade.ecompanyecompanyid === company.ecompanyid)
                    const adminGrade = newGrades.filter(newGrade => newGrade.egradename === 'Administrator')
                    const memberGrade = newGrades.filter(newGrade => newGrade.egradename === 'Member')

                    const defaultPositionDTO = {
                        ecompanyecompanyid: company.ecompanyid,
                        eadmingradeid: adminGrade.egradeid,
                        emembergradeid: memberGrade.egradeid
                    }

                    defaultPositions.push(defaultPositionDTO)

                })

                const defaultPositionPromise = knex('ecompanydefaultposition').insert(defaultPositions).transacting(trx)

                return Promise.all(defaultPositionPromise)
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
})

exports.down = function(knex) {
    const companyDefaultPositionPromise = knex('ecompanydefaultposition').delete()
    const gradeAdminMemberPromise = knex('egrade').whereIn('egradename', ['Administrator', 'Member'])
    
    return Promise.all([companyDefaultPositionPromise, gradeAdminMemberPromise])
};