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
                builder.select('eclassid', 'eclassname', 'eclassstartdate')
            }
        }
    }

    static get relationMappings() {

        const Company = require('./Company')
        const Industry = require('./Industry')
        const User = require('./User')
 
        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'eclass.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            industry: {
                relation: Model.BelongsToOneRelation,
                modelClass: Industry,
                join: {
                    from: 'eclass.eindustryeindustryid',
                    to: 'eindustry.eindustryid'
                }
            },

            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: { 
                  from : 'eclass.eclassid',
                  through: {
                    from: 'eclassusermapping.eclassclassid',
                    to: 'eclassusermapping.euseruserid'
                  },
                  to: 'euser.euserid'
                }
              }
        }
    }
}

module.exports = Class;