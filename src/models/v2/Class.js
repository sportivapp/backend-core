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
            adminList(builder) {
                builder.select('id', 'title', 'city_id', 'industry_id', 'file_id')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)');
            }
        }
    }

    static get relationMappings() {

        const Company = require('../Company');
        const Industry = require('../Industry');
        const User = require('../User');
        const ClassMedia = require('./ClassMedia');
        const City = require('../City');
 
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
            classMedia: {
                relation: Model.HasManyRelation,
                modelClass: ClassMedia,
                join: {
                    from: 'class.uuid',
                    to: 'class_media.class_uuid',
                }
            },
            city: {
                relation: Model.BelongsToOneRelation,
                modelClass: City,
                join: {
                    from: 'class.city_id',
                    to: 'ecity.ecityid',
                }
            },
        }
    }
}

module.exports = Class;