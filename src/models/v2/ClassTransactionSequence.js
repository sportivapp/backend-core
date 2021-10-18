const Model = require('./Model');

class ClassTransactionSequence extends Model {

    static getSequenceName() {
        return 'class_transaction_seq';
    }

    static getNextVal() {
        return ClassTransactionSequence.knex().raw(`SELECT nextval('class_transaction_seq')`)
            .then(result => parseInt(result.rows[0].nextval))
    }

}

module.exports = ClassTransactionSequence;
