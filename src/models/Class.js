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
                    'eclassrequirement',
                    'eclassdescription',
                    'eclassaddress',
                    'eclasstype',
                    'eclassprice',
                    'eclasspicname',
                    'eclasspicmobilenumber'
                )
            }
        }
    }

    static get relationMappings() {

        const Company = require('./Company')
        const Industry = require('./Industry')

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
            }
        }
    }
}

module.exports = Class;