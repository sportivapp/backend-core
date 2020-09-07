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

        return {
            permits: {
                modelClass: Permit,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'epermitapprovalmapping.epermitepermitid',
                    to: 'epermit.epermitid'
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