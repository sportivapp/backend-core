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
        const Company = require('./Company')

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'epermit.euseruserid',
                    to: 'euser.euserid'
                }
            },
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'epermit.ecompanycompanyid',
                    to: 'ecompany.ecompanyid'
                }
            }
        }
    }

    static get modifiers() {
        return {
            findByUserId(query, userId) {
                query.where('euseruserid', userId)
            },
            ...this.baseModifiers()
        }
    }
}

module.exports = Permit;