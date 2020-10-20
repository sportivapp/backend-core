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

    modules.forEach(module => {
        if (module.emodulename.includes('Class')) classId = module.emoduleid
        else if (module.emodulename.includes('Team')) teamId = module.emoduleid
        else if (module.emodulename.includes('Forum')) forumId = module.emoduleid
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

    let forumFunctions = [
        {
            efunctioncode: 'C' + forumId,
            efunctionname: 'Create Forum',
            emoduleemoduleid: forumId
        },
        {
            efunctioncode: 'R' + forumId,
            efunctionname: 'Read Forum',
            emoduleemoduleid: forumId
        },
        {
            efunctioncode: 'U' + forumId,
            efunctionname: 'Update Forum',
            emoduleemoduleid: forumId
        },
        {
            efunctioncode: 'D' + forumId,
            efunctionname: 'Delete Forum',
            emoduleemoduleid: forumId
        }
    ]

    return classFunctions.concat(teamFunctions).concat(forumFunctions)
}

exports.down = (knex, Promise) => knex('emodule')
    .whereIn('emodulename', ['Class', 'Team', 'Forum'])
    .delete();