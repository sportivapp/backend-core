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
            emodulename: 'Bank'
        },
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

    let bankId = 0

    modules.forEach(module => {
        if (module.emodulename.includes('Bank')) bankId = module.emoduleid
    })

    let bankFunctions = [
        {
            efunctioncode: 'C' + bankId,
            efunctionname: 'Create Bank',
            emoduleemoduleid: bankId
        },
        {
            efunctioncode: 'R' + bankId,
            efunctionname: 'Read Bank',
            emoduleemoduleid: bankId
        },
        {
            efunctioncode: 'U' + bankId,
            efunctionname: 'Update Bank',
            emoduleemoduleid: bankId
        },
        {
            efunctioncode: 'D' + bankId,
            efunctionname: 'Delete Bank',
            emoduleemoduleid: bankId
        }
    ]

    return bankFunctions;
}

exports.down = (knex, Promise) => knex('emodule')
    .whereIn('emodulename', ['Bank'])
    .delete();