const Model = require('./Model');

class PermitApprovalMapping extends Model {
    static get tableName() {
        return 'epermitapprovalmapping';
    };

    static get idColumn() {
        return 'eusereuserid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                epermitepermitid: { type: 'integer' },
                eusereuserid: { type: 'integer' }
            }
        };
    }

    static get relationMappings() {

        const Permit = require('./Permit')
        const Approval = require('./Approval')

        return {
            permits: {
                modelClass: Permit,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'epermitapprovalmapping.epermitepermitid',
                    to: 'epermit.epermitid'
                }
            },
            approval: {
                modelClass: Approval,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'epermitapprovalmapping.eapprovaleapprovalid',
                    to: 'eapproval.eapprovalid'
                }
            }
        }
    }

    static get modifiers() {
        return {
            ...this.baseModifiers()
        }
    }
}

module.exports = PermitApprovalMapping;