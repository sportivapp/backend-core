exports.up = (knex, _) => knex.transaction(trx => {
    knex('ecompany')
        .then(companies => companies.map(company => company.ecompanyid))
        .then(companyIds => knex('ecompanydefaultposition').whereIn('ecompanyecompanyid', companyIds))
        .then(companiesWithPositions => makeNewsModule(knex, companiesWithPositions, trx))
        .then(trx.commit)
        .catch(trx.rollback)
})

function makeNewsModule(knex, companiesWithPositions, trx) {
    return knex('emodule')
        .insert(newModule())
        .transacting(trx)
        .returning('*')
        .then(modules => modules[0])
        .then(module => knex('efunction')
            .insert(newFunctions(module))
            .transacting(trx)
            .returning('*')
            .then(functions => mapNewModulesToCompanies(knex, module, functions, companiesWithPositions, trx)))
}

function newModule() {
    return {
        emodulename: 'News'
    }
}

function mapNewModulesToCompanies(knex, module, functions, companiesWithPositions, trx) {

    console.log(functions)

    let moduleMappings = []
    let allFunctionMappings = []
    companiesWithPositions.forEach(company => {
        const mapping = {
            ecompanyecompanyid: company.ecompanyecompanyid,
            emoduleemoduleid: module.emoduleid,
            ecompanymodulemappingname: module.emodulename,
            ecompanymodulemappingcreateby: 0,
            ecompanymodulemappingcreatetime: Date.now()
        }

        const functionMappings = functions.map(funct => ({
            egradeegradeid: company.eadmingradeid,
            efunctionefunctioncode: funct.efunctioncode
        }))
        allFunctionMappings = allFunctionMappings.concat(functionMappings)
        moduleMappings.push(mapping)
    })

    return knex('ecompanymodulemapping').insert(moduleMappings).transacting(trx)
        .then(() => knex('egradefunctionmapping').insert(allFunctionMappings).transacting(trx))
}

function newFunctions(module) {

    let newsId = module.emoduleid

    return [
        {
            efunctioncode: 'C' + newsId,
            efunctionname: 'Create News',
            emoduleemoduleid: newsId
        },
        {
            efunctioncode: 'R' + newsId,
            efunctionname: 'Read News',
            emoduleemoduleid: newsId
        },
        {
            efunctioncode: 'U' + newsId,
            efunctionname: 'Update News',
            emoduleemoduleid: newsId
        },
        {
            efunctioncode: 'D' + newsId,
            efunctionname: 'Delete News',
            emoduleemoduleid: newsId
        },
        {
            efunctioncode: 'P' + newsId,
            efunctionname: 'Publish News',
            emoduleemoduleid: newsId
        }
    ]
}

exports.down = (knex, Promise) => knex('emodule')
    .where('emodulename', 'News')
    .delete();