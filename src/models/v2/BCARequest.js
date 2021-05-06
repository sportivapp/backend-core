//FILE TO DELETE IF PAYMENT SEPARATED
const Model = require('./Model');

class BCARequest extends Model {
    static get tableName() {
        return 'bca_request';
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
 
        return {

        }
    }
}

module.exports = BCARequest;