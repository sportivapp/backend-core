exports.up = (knex, _) => knex.transaction(trx => {
    knex('egrade')
        .insert(newModules())
        .transacting(trx)
        .returning('*')
        .then(modules => {
            const promises = []
            const createFunctions = knex('efunction')
                .insert(newFunctions(modules))
                .transacting(trx)
            const addMappings = mapNewModulesToCompanies(knex, modules, trx)
            promises.push(createFunctions)
            promises.push(addMappings)
            return Promise.all(promises)
        })
        .then(trx.commit)
        .catch(trx.rollback)
})

exports.up = (knex, _) => knex.transaction(trx => {
    knex('ecompany')
        .then(companies => {
            const promises = []
            const mappings = []
            companies.forEach(company => {
            
                const adminGrade = {
                    egradename: 'Administrator',
                    egradedescription: 'Administrator of Company',
                    ecompanyecompanyid: company.ecompanyid
                }

                const memberGrade = {
                    egradename: 'Member',
                    egradedescription: 'Member of Company',
                    ecompanyecompanyid: company.ecompanyid
                }

                mappings.push(adminGrade)
                mappings.push(memberGrade)

            })

            const addGrades = knex('egrade')
            .insert(mappings)
            .transacting(trx)

            return Promise.all(addGrades)
            .then(grades => {
                companies.forEach(company => {
                    const grade = grades.filter(grade => grade.ecompanyecompanyid === company.ecompanyid)

                    const defaultPositionDTO = {
                        ecompanyecompanyid: company.ecompanyid,
                        eadminid
                    }

                })
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
})

function newGrades() {
    return [
        {
            egradename: 'Administrator',
            egradedescription: 'Administrator of Company',
            ecompanyecompanyid: company.ecompanyid
        },
        {
            egradename: 'Member',
            egradedescription: 'Member of Company',
            ecompanyecompanyid: company.ecompanyid
        }
    ]
}

function addCompanyDefaultPositions(knex, modules, trx) {

    knex('ecompanydefaultposition')
        .then(companies => {
            let mappings = []
            companies.forEach(company => {
                modules.forEach(module => {
                    const mapping = {
                        ecompanyecompanyid: company.ecompanyid,
                        emoduleemoduleid: module.emoduleid,
                        ecompanymodulemappingname: module.emodulename,
                        ecompanymodulemappingcreateby: 0,
                        ecompanymodulemappingcreatetime: Date.now()
                    }
                    mappings.push(mapping)
                })
            })
            return knex('ecompanymodulemapping').insert(mappings).transacting(trx)
        })
}

function newFunctions(modules) {

    let classId = 0
    let teamId = 0
    let forumId = 0
    let theoryId = 0

    modules.forEach(module => {
        if (module.emodulename.includes('Class')) classId = module.emoduleid
        else if (module.emodulename.includes('Team')) teamId = module.emoduleid
        else if (module.emodulename.includes('Forum')) forumId = module.emoduleid
        else if (module.emodulename.includes('Theory')) theoryId = module.emoduleid
    })

    let classFunctions = [
        {
            efunctioncode: 'C' + classId,
            efunctionname: 'Create Class',
            emoduleemoduleid: classId
        },
        {
            efunctioncode: 'R' + classId,
            efunctionname: 'Read Class',
            emoduleemoduleid: classId
        },
        {
            efunctioncode: 'U' + classId,
            efunctionname: 'Update Class',
            emoduleemoduleid: classId
        },
        {
            efunctioncode: 'D' + classId,
            efunctionname: 'Delete Class',
            emoduleemoduleid: classId
        }
    ]

    let teamFunctions = [
        {
            efunctioncode: 'C' + teamId,
            efunctionname: 'Create Team',
            emoduleemoduleid: teamId
        },
        {
            efunctioncode: 'R' + teamId,
            efunctionname: 'Read Team',
            emoduleemoduleid: teamId
        },
        {
            efunctioncode: 'U' + teamId,
            efunctionname: 'Update Team',
            emoduleemoduleid: teamId
        },
        {
            efunctioncode: 'D' + teamId,
            efunctionname: 'Delete Team',
            emoduleemoduleid: teamId
        }
    ]

    let theoryFunctions = [
        {
            efunctioncode: 'C' + theoryId,
            efunctionname: 'Create Theory',
            emoduleemoduleid: theoryId
        },
        {
            efunctioncode: 'R' + theoryId,
            efunctionname: 'Read Theory',
            emoduleemoduleid: theoryId
        },
        {
            efunctioncode: 'U' + theoryId,
            efunctionname: 'Update Theory',
            emoduleemoduleid: theoryId
        },
        {
            efunctioncode: 'D' + theoryId,
            efunctionname: 'Delete Theory',
            emoduleemoduleid: theoryId
        }
    ]

    let forumFunctions = [
        {
            efunctioncode: 'P' + forumId,
            efunctionname: 'Set Public Status Forum',
            emoduleemoduleid: forumId
        },
        {
            efunctioncode: 'D' + forumId,
            efunctionname: 'Delete Forum',
            emoduleemoduleid: forumId
        }
    ]

    return classFunctions.concat(teamFunctions).concat(forumFunctions).concat(theoryFunctions)
}

exports.down = (knex, Promise) => knex('emodule')
    .whereIn('emodulename', ['Class', 'Team', 'Theory', 'Forum'])
    .delete();