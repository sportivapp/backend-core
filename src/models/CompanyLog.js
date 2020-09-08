const Model = require('./Model');

class CompanyLog extends Model {
    static get tableName() {
        return 'ecompanylog';
    };

    static get idColumn() {
        return 'ecompanylogid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eusereuserid: { type: 'integer' },
                ecompanyecompanyid: { type: 'integer' }
            }
        };
    }
    
    static get relationMappings() {

        const User = require('./User');
        const Company = require('./Company');

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'ecompanylog.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'ecompanylog.eusereuserid',
                    to: 'euser.euserid'
                }
            }
        }
    }

}

module.exports = CompanyLog;