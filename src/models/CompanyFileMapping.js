const Model = require('./Model');

class CompanyFileMapping extends Model {
    static get tableName() {
        return 'ecompanyfilemapping';
    };

    static get idColumn() {
        return 'ecompanyfilemappingid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                ecompanyecompanyid: { type: 'integer' },
                efilefileid: { type: 'integer' }
            }
        };
    }
}

module.exports = CompanyFileMapping