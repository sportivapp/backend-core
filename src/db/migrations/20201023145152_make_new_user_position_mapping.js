exports.up = (knex, _) => knex.transaction(trx => {
    knex('ecompany')
        .then(companies => {
            
            return knex('egrade')
            .then(grades => {

                return knex('ecompanyusermapping')
                .then(companyUsers => {

                    const userPositionMappings = []
                    const filterGrades = grades.filter(grade => grade.egradename === 'Administrator' || grade.egradename === 'Member')
                    
                    companies.forEach(company => {

                        const newGrades = filterGrades.filter(filterGrade => filterGrade.ecompanyecompanyid === company.ecompanyid)
                        const adminGrade = newGrades.filter(newGrade => newGrade.egradename === 'Administrator')
                        const memberGrade = newGrades.filter(newGrade => newGrade.egradename === 'Member')
                        const membersListInCompany = companyUsers.filter(companyUser => companyUser.ecompanyecompanyid === company.ecompanyid && companyUser.eusereuserid !== company.ecompanycreateby)
    
                        // console.log(membersListInCompany)
    
                        const adminUsersPositionDTO = {
                            eusereuserid: company.ecompanycreateby,
                            egradeegradeid: adminGrade[0].egradeid,
                            euserpositionmappingcreateby: company.ecompanycreateby,
                            euserpositionmappingcreatetime: Date.now()
                        }

                        userPositionMappings.push(adminUsersPositionDTO)

                        membersListInCompany.forEach( member => {

                            const memberUsersPositionDTO = {
                                eusereuserid: member.eusereuserid,
                                egradeegradeid: memberGrade[0].egradeid,
                                euserpositionmappingcreateby: member.eusereuserid,
                                euserpositionmappingcreatetime: Date.now()
                            }

                            userPositionMappings.push(memberUsersPositionDTO)

                        })
        
                    })

                    return knex('euserpositionmapping').insert(userPositionMappings).transacting(trx)

                })
                
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
})

exports.down = (knex, Promise) => knex('euserpositionmapping').delete();