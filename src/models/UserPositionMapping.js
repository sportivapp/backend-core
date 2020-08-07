const Model = require('./Model');

class UserPositionMapping extends Model {
    static get tableName() {
        return 'euserpositionmapping';
    };

    static get idColumn() {
        return 'eusereuserid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eusereuserid: { type: 'integer' },
                egradeegradeid: { type: 'integer' }
            }
        };
    }
}

module.exports = UserPositionMapping;