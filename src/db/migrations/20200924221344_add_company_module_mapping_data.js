exports.up = (knex) =>
    knex.transaction(trx => {
        knex('ecompanymodulemapping')
            .del()
            .then(ignored => {
                return knex('ecompany')
                    .select('ecompanyid')
                    .whereNull('ecompanyparentid')
            })
            .then(companies => {
                return knex('emodule')
                    .select('emoduleid', 'emodulename')
                    .then(modules => ({ companies: companies, modules: modules }))
            })
            .then(({ companies, modules }) => createCompanyModuleMappings(companies, modules, knex, trx))
            .then(trx.commit)
            .catch(trx.rollback)
    })

function createCompanyModuleMappings(companies, modules, knex, trx) {
    let companyModules = []
    companies.forEach(company => {
        modules.forEach(module => {
            const companyModule = {
                ecompanyecompanyid: company.ecompanyid,
                emoduleemoduleid: module.emoduleid,
                ecompanymodulemappingname: module.emodulename
            }
            companyModules.push(companyModule)
        })
    })
    return knex('ecompanymodulemapping').insert(companyModules)
        .transacting(trx)
        .then(ignored => companies)
}

exports.down = (knex) => knex('ecompanymodulemapping').del()
