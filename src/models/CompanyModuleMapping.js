const Model = require('./Model');

class CompanyModuleMapping extends Model {
    static get tableName() {
        return 'ecompanymodulemapping';
    };

    static get idColumn() {
        return 'ecompanymodulemappingid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                ecompanymodulemappingname: { type: 'string' },
                ecompanyecompanyid: { type: 'integer' },
                emoduleemoduleid: { type: 'integer' }
            }
        };
    }
}

module.exports = CompanyModuleMapping