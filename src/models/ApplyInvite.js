const Model = require('./Model');

class ApplyInvite extends Model {
    static get tableName() {
        return 'eapplyinvite';
    };

    static get idColumn() {
        return 'eapplyinviteid';
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
                    from: 'eapplyinvite.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'eapplyinvite.eusereuserid',
                    to: 'euser.euserid'
                }
            }
        }
    }

}

module.exports = ApplyInvite;