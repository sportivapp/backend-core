const Model = require('./Model');

class ApprovalUser extends Model {
    static get tableName() {
        return 'eapprovaluser';
    };

    static get idColumn() {
        return 'eapprovaluserid';
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
        const Approval = require('./Approval');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'eapprovaluser.eusereuserid',
                    to: 'euser.euserid'
                }
            },
            approval: {
                relation: Model.BelongsToOneRelation,
                modelClass: Approval,
                join: {
                    from: 'eapprovaluser.eapprovaleapprovalid',
                    to: 'eapproval.eapprovalid'
                }
            }
        }
    }

}

module.exports = ApprovalUser;