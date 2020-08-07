const Model = require('./Model')

class Permit extends Model {
    static get tableName() {
        return 'epermit'
    };

    static get idColumn() {
        return 'epermitid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['epermitstatus', 'epermitdescription', 'epermitstartdate', 'epermitenddate'],
            properties: {
                epermitstatus: { type: 'integer' },
                epermitdescription: { type: 'string', minLength: 1, maxLength: 256 },
                epermitstartdate: { type: 'string', format: 'date' },
                epermitenddate: { type: 'string', format: 'date' }
            }
        };
    }

    static get relationMappings() {

        const User = require('./User')

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'epermit.euseruserid',
                    to: 'euser.euserid'
                }
            }
        }
    }

    static get modifiers() {
        return {
            findByUserId(query, userId) {
                query.where('euseruserid', userId)
            },
            findByDeleteStatus(query, deleteStatus) {
                query.where('epermitdeletestatus', deleteStatus)
            }
        }
    }
}

module.exports = Permit;