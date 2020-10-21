exports.up = (knex, _) => knex.transaction(trx => {
    knex('emodule')
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

function newModules() {
    return [
        {
            emodulename: 'Class'
        },
        {
            emodulename: 'Team'
        },
        {
            emodulename: 'Theory'
        },
        {
            emodulename: 'Forum'
        }
    ]
}

function mapNewModulesToCompanies(knex, modules, trx) {

    knex('ecompany')
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
            efunctioncode: 'R' + teamId,
            efunctionname: 'Read Theory',
            emoduleemoduleid: theoryId
        },
        {
            efunctioncode: 'U' + teamId,
            efunctionname: 'Update Theory',
            emoduleemoduleid: theoryId
        },
        {
            efunctioncode: 'D' + teamId,
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