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
                builder.select('uuid', 'title', 'administration_fee', 'city_id', 'industry_id', 'file_id')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)');
            },
            adminDetail(builder) {
                builder.select('uuid', 'title', 'description', 'administration_fee', 'pic_name', 'pic_mobile_number')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)')
                    .withGraphFetched('classCategories(list)')
                    .withGraphFetched('coaches(baseAttributes)');
            },
            userDetail(builder) {
                builder.select('uuid', 'title', 'description', 'administration_fee', 'pic_name', 'pic_mobile_number')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)')
                    .withGraphFetched('classCategories(list)')
                    .withGraphFetched('coaches(baseAttributes)')
                    .withGraphFetched('company(baseAttributes)')
                    .withGraphFetched('participants(baseAttributes)');
            }
        }
    }

    static get relationMappings() {

        const Company = require('../Company');
        const Industry = require('../Industry');
        const User = require('../User');
        const ClassMedia = require('./ClassMedia');
        const City = require('../City');
        const ClassCategory = require('./ClassCategory');
        const ClassCoach = require('./ClassCoach');
        const ClassCategoryParticipant = require('./ClassCategoryParticipant');
 
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
            classCategories: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class.uuid',
                    to: 'class_category.class_uuid'
                }
            },
            coaches: {
                relation: Model.HasManyRelation,
                modelClass: ClassCoach,
                join: {
                    from: 'class.uuid',
                    to: 'class_coach.class_uuid',
                }
            },
            participants: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategoryParticipant,
                join: {
                    from: 'class.uuid',
                    to: 'class_category_participant.class_uuid',
                }
            }
        }
    }
}

module.exports = Class;