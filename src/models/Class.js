const Model = require('./Model');

class Class extends Model {
    static get tableName() {
        return 'eclass';
    };

    static get idColumn() {
        return 'eclassid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {

            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eclassid', 'eclassname', 'eclasslogo')
            }
        }
    }

    static get relationMappings() {

        const User = require('./User')
        const Industry = require('./Industry')

        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'eclass.eclassid',
                    through: {
                        from: 'eclassusermapping.eclasseclassid',
                        to: 'eclassusermapping.eusereuserid'
                    },
                    to: 'euser.euserid'
                }
            },
            industry: {
                relation: Model.BelongsToOneRelation,
                modelClass: Industry,
                join: {
                    from: 'eclass.eindustryeindustryid',
                    to: 'eindustry.eindustryid'
                }
            }
        }
    }
}

module.exports = Class;