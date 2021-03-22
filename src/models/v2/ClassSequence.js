const Model = require('./Model');

class ClassTransactionSequence extends Model {

    sequenceName = 'class_transaction_seq';

    static getSequenceName() {
        return sequenceName;
    }

    static getNextVal() {
        return ClassTransactionSequence.knex().raw(`SELECT nextval('${sequenceName}')`)
            .then(result => result.rows[0].nextval)
    }

}

module.exports = ClassTransactionSequence;
