const Model = require('./Model');

class ClassComplaintSequence extends Model {

    static getSequenceName() {
        return 'class_complaint_seq';
    }

    static getNextVal() {
        return ClassComplaintSequence.knex().raw(`SELECT nextval('class_complaint_seq')`)
            .then(result => parseInt(result.rows[0].nextval))
    }

}

module.exports = ClassComplaintSequence;
