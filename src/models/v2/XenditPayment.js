const Model = require('./Model');

class XenditPayment extends Model {
    static get tableName() {
        return 'xendit_payment';
    };

    static get idColumn() {
        return 'id'
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

module.exports = XenditPayment;