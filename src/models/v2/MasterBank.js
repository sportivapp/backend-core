const Model = require('./Model');

class MasterBank extends Model {
    static get tableName() {
        return 'master_bank';
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
            baseAttributes(builder) {
                builder.select('id', 'name', 'code');
            }
        }
    }

    static get relationMappings() {

        return {

        }
    }
}

module.exports = MasterBank;