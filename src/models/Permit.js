const Model = require('./Model');

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
            notDeleted(builder) {
                builder.where('epermitdeletestatus', false)
            },
            deleted(builder) {
                builder.where('epermitdeletestatus', true)
            },
            delete(builder, userId) {
                builder.patch({
                    epermitdeletestatus: true,
                    epermitdeleteby: userId,
                    epermitdeletetime: new Date()
                })
            }
        }
    }
}

module.exports = Permit;