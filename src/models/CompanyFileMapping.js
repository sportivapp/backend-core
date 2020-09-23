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

    static get relationMappings() {

        const Company = require('./Company');
        const File = require('./File');

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'ecompanyfilemapping.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            theory: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'ecompanyfilemapping.efileefileid',
                    to: 'efile.efileid'
                }
            },
        }

    }

}

module.exports = CompanyFileMapping