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

    static get relationMappings() {

        const Module = require('./Module')

        return {
            module: {
                relation: Model.BelongsToOneRelation,
                modelClass: Module,
                join: {
                    from: 'ecompanymodulemapping.emoduleemoduleid',
                    to: 'emodule.emoduleid'
                }
            }
        }
    }
}

module.exports = CompanyModuleMapping