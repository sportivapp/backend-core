const SessionStatusEnum = require('../enum/SessionStatusEnum');
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
            register(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('company(baseAttributes)')
            },
            adminList(builder) {
                builder.select('uuid', 'title', 'administration_fee', 'company_id')
                    .modify('notDeleted')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)');
            },
            adminDetail(builder) {
                builder.select('uuid', 'title', 'description', 'pic_mobile_number', 'address', 'address_name', 'administration_fee', 'company_id')
                    .modify('notDeleted')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)')
                    .withGraphFetched('classCategories(list)')
                    .withGraphFetched('coaches(baseAttributes)')
                    .withGraphFetched('pic(pic)')
                    .withGraphFetched('state(baseAttributes)');
            },
            userDetail(builder) {
                builder.select('uuid', 'title', 'description', 'pic_mobile_number', 'address', 'address_name', 'administration_fee')
                    .modify('notDeleted')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)')
                    .withGraphFetched('classCategories(list)')
                    .withGraphFetched('coaches(baseAttributes)')
                    .withGraphFetched('pic(pic)')
                    .withGraphFetched('company(baseAttributes)');
            },
            notDeleted(builder) {
                builder.whereRaw('delete_time IS NULL');
            },
            participants(builder) {
                builder.select('uuid')
                    .withGraphFetched('classCategories(uuidAndTitle).[participants(participant).[user(basic).[file(baseAttributes)]]]')
            },
            coachClass(builder, userId, status) {
                builder.select('class.uuid', 'class.title')
                    .modify('notDeleted')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list).[file(baseAttributes)]')
                    .withGraphFetched('company(baseAttributes)')
                    .withGraphJoined('classCategories(uuidAndTitle).[coaches(basic), categorySessions(list)]')
                        .where('classCategories:coaches.user_id', userId)
                        .where('classCategories:categorySessions.start_date', '>=', Date.now())
                        .where('classCategories:categorySessions.status', status)
                        .orderBy('classCategories:categorySessions.start_date', 'ASC');
            },
            myClass(builder, sessionUuid) {
                builder.select('class.uuid', 'class.title')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list).[file(baseAttributes)]')
                    .withGraphFetched('company(baseAttributes)')    
                    .withGraphJoined('classCategories(uuidAndTitle).[categorySessions(list)]')
                        .where('classCategories:categorySessions.uuid', sessionUuid);
            },
            basic(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphFetched('classMedia(list)')
            },
            categoriesTitleWithRating(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('classCategories(titleWithRating)');
            },
            administrationFee(builder) {
                builder.select('uuid', 'administration_fee');
            },
            uuidAndTitle(builder) {
                builder.select('uuid', 'title');
            },
            uuidAndTitleWithPicture(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('classMedia(list)');
            },
            myClassHistory(builder, userId) {
                builder.select('class.uuid', 'class.title')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('city(baseAttributes)')
                    .withGraphJoined(`classCategories(uuidAndTitle).[categorySessions(basicStartEnd).[participantSession(sessionParticipants)]]`)
                    .where('classCategories:categorySessions:participantSession.user_id', userId)
            },
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
        const State = require('../State');
 
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
            },
            pic: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class.pic_id',
                    to: 'euser.euserid',
                }
            },
            state: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'class.state_id',
                    to: 'estate.estateid',
                }
            },
        }
    }
}

module.exports = Class;