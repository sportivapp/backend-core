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
                builder.select('eclassid',
                    'eclassname',
                    'eclassstartdate',
                    'eclassenddate',
                    'eclassstarthour',
                    'eclassstartminute',
                    'eclassendhour',
                    'eclassendminute',
                    'eclassdescription',
                    'eclassaddress',
                    'eclasstype',
                    'eclassprice',
                    'eclasspicname',
                    'eclasspicmobilenumber',
                    'efileefileid'
                )
            }
        }
    }

    static get relationMappings() {

        const Company = require('./Company')
        const Industry = require('./Industry')
        const ClassRequirement = require('./ClassRequirement')
        const User = require('./User')
        const File = require('./File')
 
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

            requirements: {
                relation: Model.HasManyRelation,
                modelClass: ClassRequirement,
                join: {
                    from: 'eclass.eclassid',
                    to: 'eclassrequirement.eclasseclassid'
                }
            },
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: { 
                  from : 'eclass.eclassid',
                  through: {
                    from: 'eclassusermapping.eclasseclassid',
                    to: 'eclassusermapping.eusereuserid'
                  },
                  to: 'euser.euserid'
                }
            },
            picture: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'eclass.efileefileid',
                    to: 'efile.efileid'
                }
            }
        }
    }
}

module.exports = Class;