exports.up = (knex, _) => knex.transaction(trx => {
    knex('ecompany')
        .then(companies => companies.map(company => company.ecompanyid))
        .then(companyIds => knex('ecompanydefaultposition').whereIn('ecompanyecompanyid', companyIds))
        .then(companiesWithPositions => makeTournamentModule(knex, companiesWithPositions, trx))
        .then(trx.commit)
        .catch(trx.rollback)
})

function makeTournamentModule(knex, companiesWithPositions, trx) {
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
        emodulename: 'Tournament'
    }
}

function mapNewModulesToCompanies(knex, module, functions, companiesWithPositions, trx) {

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

    let tournamentId = module.emoduleid

    return [
        {
            efunctioncode: 'C' + tournamentId,
            efunctionname: 'Create Tournament',
            emoduleemoduleid: tournamentId
        },
        {
            efunctioncode: 'R' + tournamentId,
            efunctionname: 'Read Tournament',
            emoduleemoduleid: tournamentId
        },
        {
            efunctioncode: 'U' + tournamentId,
            efunctionname: 'Update Tournament',
            emoduleemoduleid: tournamentId
        },
        {
            efunctioncode: 'D' + tournamentId,
            efunctionname: 'Delete Tournament',
            emoduleemoduleid: tournamentId
        }
    ]
}

exports.down = (knex, Promise) => knex('emodule')
    .where('emodulename', 'Tournament')
    .delete();