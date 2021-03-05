const Model = require('./Model');
const sessionStatusEnum = require('../enum/SessionStatusEnum');

class ClassCategory extends Model {
    static get tableName() {
        return 'class_category';
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
            list(builder) {
                builder.select('uuid', 'title', 'price')
            },
            adminDetail(builder) {
                builder.select('uuid', 'title', 'description', 'price', 'requirements')
                    .withGraphFetched('categorySessions(list)')
                    .withGraphFetched('coaches(baseAttributes)');
            },
            userDetail(builder) {
                builder.select('class_category.uuid', 'class_category.title', 'description', 'price', 'requirements')
                    .withGraphFetched('coaches(baseAttributes).[user(basic)]')
                    .withGraphFetched('participants(participant).[user(basic)]')
                    .withGraphJoined('categorySessions(list)')
            },
            price(builder) {
                builder.select('price');
            },
            uuidAndTitle(builder) {
                builder.select('uuid', 'title');
            },
            myCategory(builder, participant, status) {
                builder.select('uuid', 'title')
                    .withGraphFetched('class(basic)')
                    .withGraphFetched('categorySessions(list)')
                    .modifyGraph('categorySessions', builder => {
                        builder.where('start_date', '>=', Date.now())
                            .where('start_date', '>=', participant.start)
                            .where('status', status)
                            .orderBy('start_date', 'ASC');
                    });
            },
            coachCategory(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('class(basic)')
                    .withGraphFetched('categorySessions(list) as ongoingSessions')
                    .modifyGraph('ongoingSessions', builder => {
                        builder.where('start_date', '>=', Date.now())
                            .where('status', sessionStatusEnum.ONGOING)
                            .orderBy('start_date', 'ASC');
                    })
                    .withGraphFetched('categorySessions(list) as upcomingSessions')
                    .modifyGraph('upcomingSessions', builder => {
                        builder.where('start_date', '>=', Date.now())
                            .where('status', sessionStatusEnum.UPCOMING)
                            .orderBy('start_date', 'ASC');
                    });
            },
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategorySession = require('./ClassCategorySession');
        const ClassCategoryCoach = require('./ClassCategoryCoach');
        const ClassCategoryParticipant = require('./ClassCategoryParticipant');
        const ClassCategorySchedule = require('./ClassCategorySchedule');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category.class_uuid',
                    to: 'class.uuid',
                }
            },
            categorySessions: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategorySession,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_session.class_category_uuid',
                }
            },
            coaches: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategoryCoach,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_coach.class_category_uuid',
                }
            },
            participants: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategoryParticipant,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_participant.class_category_uuid',
                }
            },
            schedules: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategorySchedule,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_schedule.class_category_uuid',
                }
            }
        }
    }
}

module.exports = ClassCategory;