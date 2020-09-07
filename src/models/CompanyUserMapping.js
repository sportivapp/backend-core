const Model = require('./Model');

class CompanyUserMapping extends Model {
    static get tableName() {
        return 'ecompanyusermapping';
    };

    static get idColumn() {
        return 'ecompanyecompanyid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                ecompanyecompanyid: { type: 'integer' },
                eusereuserid: { type: 'integer' }
            }
        };
    }

    static get modifiers() {
        return {
            ...this.baseModifiers()
        }
    }

    static get relationMappings() {

        const User = require('./User')

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'ecompanyusermapping.eusereuserid',
                    to: 'euser.euserid'
                }
            }
        }
    }
}

module.exports = CompanyUserMapping;