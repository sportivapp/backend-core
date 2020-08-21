const Model = require('./Model');

class CompanySequence extends Model {

    static getSequenceName(companyId) {
        return `company_${companyId}_nik_seq`
    }

    static createSequence (companyId) {
        let sequenceName = CompanySequence.getSequenceName(companyId)
        let ownedBy = 'ecompany.ecompanynik'
        return CompanySequence.knex().raw(`CREATE SEQUENCE ${sequenceName} START 1 OWNED BY ${ownedBy}`)
    }

    static getNextVal(companyId) {
        let sequenceName = CompanySequence.getSequenceName(companyId)
        return CompanySequence.knex().raw(`SELECT nextval('${sequenceName}')`)
            .then(result => result.rows[0].nextval)
    }

}

module.exports = CompanySequence;