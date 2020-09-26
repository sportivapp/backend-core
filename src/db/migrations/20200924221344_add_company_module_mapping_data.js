exports.up = (knex) =>
    knex.transaction(trx => {
        knex('ecompany')
            .select('ecompanyid')
            .whereNull('ecompanyparentid')
            .then(companies => {
                return knex('emodule')
                    .select('emoduleid', 'emodulename')
                    .then(modules => ({ companies: companies, modules: modules }))
            })
            .then(({ companies, modules }) => {
                return knex('ecompanymodulemapping')
                    .orderBy('ecompanymodulemappingid', 'DESC')
                    .first()
                    .then(mapping => ({ companies: companies, modules: modules, startId: mapping.ecompanymodulemappingid }))
            })
            .then(({ companies, modules, startId }) => createCompanyModuleMappings(companies, modules, startId, knex, trx))
            .then(trx.commit)
            .catch(trx.rollback)
    })

function createCompanyModuleMappings(companies, modules, startId, knex, trx) {
    let companyModules = []
    companies.forEach(company => {
        modules.forEach(module => {
            const companyModule = {
                ecompanymodulemappingid: startId + 1,
                ecompanyecompanyid: company.ecompanyid,
                emoduleemoduleid: module.emoduleid,
                ecompanymodulemappingname: module.emodulename
            }
            companyModules.push(companyModule)
            startId++
        })
    })
    return knex('ecompanymodulemapping').insert(companyModules)
        .transacting(trx)
        .then(ignored => companies)
}

exports.down = (knex) => {
    knex('ecompanymodulemapping')
        .del()
};
