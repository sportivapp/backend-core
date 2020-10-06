exports.up = (knex) =>
    knex.transaction(trx => {
        knex('egradefunctionmapping')
            .del()
            .then(ignored => {
                return knex('ecompany')
                    .select('ecompanyid')
                    .whereNull('ecompanyparentid')
            })
            .then(companies => {
                if (companies.length < 1) return trx.rollback()
                return companies
            })
            .then(companies => createAdmins(companies,knex, trx))
            .then(grades => {
                return knex('efunction')
                    .select('efunctioncode')
                    .then(functions => ({ grades: grades, functions: functions }))
            })
            .then(({ grades, functions }) => createGradeFunctionMappings(grades, functions, knex, trx))
            .then(grades => mapUserAndGrades(grades, knex, trx))
            .then(trx.commit)
            .catch(trx.rollback)
    })

function createAdmins(companies, knex, trx) {
    let admins = companies.map(company => ({
        egradename: 'Administrator',
        egradedescription: 'Administrator of Company',
        egradecreateby: 0,
        egradecreatetime: Date.now(),
        ecompanyecompanyid: company.ecompanyid
    }))
    return knex('egrade').insert(admins).transacting(trx).returning('*')
}

function createGradeFunctionMappings(grades, functions, knex, trx) {
    let gradeFunctions = []
    grades.forEach(grade => {
        functions.forEach(func => {
            const gradeFunction = {
                egradeegradeid: grade.egradeid,
                efunctionefunctioncode: func.efunctioncode
            }
            gradeFunctions.push(gradeFunction)
        })
    })
    return knex('egradefunctionmapping').insert(gradeFunctions)
        .transacting(trx)
        .then(ignored => grades)
}

function mapUserAndGrades(grades, knex, trx) {
    let promises = grades.map(grade => {
        return knex('ecompanyusermapping')
            .where('ecompanyecompanyid', grade.ecompanyecompanyid)
            .andWhere('ecompanyusermappingpermission', 10)
            .then(mappings => {
                return mappings.map(mapping => ({
                    eusereuserid: mapping.eusereuserid,
                    egradeegradeid: grade.egradeid,
                    euserpositionmappingcreateby: 0,
                    euserpositionmappingcreatetime: Date.now()
                }))
            })
            .then(userPositionMappings => knex('euserpositionmapping').insert(userPositionMappings).transacting(trx))
    })

    return Promise.all(promises)
}

exports.down = (knex) => knex('egrade').where('egradename', 'Administrator').del();
