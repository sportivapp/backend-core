const Model = require('./Model');

class ClassSequence extends Model {

    sequenceName = 'class_transaction_seq';

    static getSequenceName() {
        return sequenceName;
    }

    static getNextVal() {
        return ClassSequence.knex().raw(`SELECT nextval('${sequenceName}')`)
            .then(result => result.rows[0].nextval)
    }

}

module.exports = ClassSequence;