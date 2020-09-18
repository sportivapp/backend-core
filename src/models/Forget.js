const Model = require('./Model');

class Forget extends Model {
    static get tableName() {
        return 'eforget';
    };

    static get idColumn() {
        return 'eforgetid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {

            }
        };
    }

}

module.exports = Forget;