const SessionStatusEnum = require('../enum/SessionStatusEnum');
const Model = require('./Model');

class ClassCategorySession extends Model {
    static get tableName() {
        return 'class_category_session';
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
                builder.select('uuid', 'class_category_uuid', 'month_utc', 'start_date', 'end_date', 'start_time', 'absence_time', 'status')
                    .orderBy('start_date', 'ASC');
            },
            sessionParticipants(builder) {
                builder.select('uuid', 'start_date', 'status')
                    .withGraphFetched('sessionParticipants(sessionParticipants)')
                    .withGraphFetched('classCategory(uuidAndTitle)');
            },
            basicStartEnd(builder) {
                builder.select('uuid', 'start_date', 'end_date', 'status');
            },
            mySessions(builder, userId) {
                builder.withGraphJoined('participantSession(sessionParticipants)')
                    .where('participantSession.user_id', userId)
            },
            single(builder) {
                builder.select('uuid', 'class_category_uuid', 'month_utc', 'start_date', 'end_date', 'start_time', 'absence_time', 'status');
            },
            bookableSessions(builder, classCategoryUuid, start, end, userId) {
                builder.select('class_category_session.uuid', 'start_date', 'end_date', 'title', 'price')
                    .where('class_category_uuid', classCategoryUuid)
                    .where('status', SessionStatusEnum.UPCOMING)
                    .where('start_date', '>=', start)
                    .where('end_date', '<=', end)
                    .orderBy('start_date', 'ASC')
                    .withGraphFetched('participantSession(sessionParticipants)')
                    .modifyGraph('participantSession', builder => {
                        builder.where('user_id', userId);
                    });
            },
            price(builder) {
                builder.select('price');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const ClassCategoryParticipantSession = require('./ClassCategoryParticipantSession');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category_session.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_session.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            participantSession: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategoryParticipantSession,
                join: {
                    from: 'class_category_session.uuid',
                    to: 'class_category_participant_session.class_category_session_uuid',
                }
            }
        }
    }
}

module.exports = ClassCategorySession;