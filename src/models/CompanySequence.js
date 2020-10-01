const Model = require('./Model');

class CompanySequence extends Model {

    static getSequenceName(companyId) {
        return `company_${companyId}_nik_seq`
    }

    static createSequence (companyId, trx) {
        let sequenceName = CompanySequence.getSequenceName(companyId)
        let ownedBy = 'ecompany.ecompanynik'
        return CompanySequence.knex().raw(`CREATE SEQUENCE ${sequenceName} START 1 OWNED BY ${ownedBy}`).transacting(trx)
    }

    static getNextVal(companyId) {
        let sequenceName = CompanySequence.getSequenceName(companyId)
        return CompanySequence.knex().raw(`SELECT nextval('${sequenceName}')`)
            .then(result => result.rows[0].nextval)
    }

    static deleteSequence(companyId, trx) {
        let sequenceName = CompanySequence.getSequenceName(companyId)
        return CompanySequence.knex().raw(`DROP SEQUENCE IF EXISTS ${sequenceName}`).transacting(trx)
    }

}

module.exports = CompanySequence;