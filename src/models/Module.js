const Model = require('./Model');

class Module extends Model {
    static get tableName() {
        return 'emodule';
    };

    static get idColumn() {
        return 'emoduleid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                emodulename: { type: 'string' }
            }
        };
    }
}

module.exports = Module