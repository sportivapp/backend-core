//FILE TO DELETE IF PAYMENT SEPARATED
const Model = require('./Model');

class DokuRequest extends Model {
    static get tableName() {
        return 'doku_request';
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

        // const Class = require('./Class');
 
        return {
            // class: {
            //     relation: Model.BelongsToOneRelation,
            //     modelClass: Class,
            //     join: {
            //         from: 'class_transaction.class_uuid',
            //         to: 'class.uuid',
            //     }
            // },
        }
    }
}

module.exports = DokuRequest;