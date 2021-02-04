const Model = require('./Model');

class Class extends Model {
    static get tableName() {
        return 'class';
    };

    static get idColumn() {
        return 'uuid'
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
                builder.select('id', 'title', 'description', 'address', 'city_id', 'industry_id', 
                'pic_name', 'pic_mobile_number', 'company_id')
            }
        }
    }

    static get relationMappings() {

        const Company = require('../Company')
        const Industry = require('../Industry')
        const User = require('../User')
        const File = require('../File')
 
        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'class.company_id',
                    to: 'ecompany.ecompanyid'
                }
            },
            industry: {
                relation: Model.BelongsToOneRelation,
                modelClass: Industry,
                join: {
                    from: 'class.industry_id',
                    to: 'eindustry.eindustryid'
                }
            },
            creator: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class.create_by',
                    to: 'euser.euserid',
                }
            },
            media: {
                relation: Model.HasManyRelation,
                modelClass: File,
                join: {
                    from: 'eclass.file_id',
                    to: 'efile.efileid'
                }
            }
        }
    }
}

module.exports = Class;