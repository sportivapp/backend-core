const Model = require('./Model');

class Disbursement extends Model {
    static get tableName() {
        return 'disbursement';
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

module.exports = Disbursement;