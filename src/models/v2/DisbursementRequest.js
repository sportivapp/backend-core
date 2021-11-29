const Model = require('./Model');

class DisbursementRequest extends Model {
    static get tableName() {
        return 'disbursement_request';
    };

    static get idColumn() {
        return 'uuid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {

            }
        };
    }

    static get modifiers() {
        return {
        }
    }

    static get relationMappings() {

        

    }
}

module.exports = DisbursementRequest;