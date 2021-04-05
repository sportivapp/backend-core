const SessionStatusEnum = require('../enum/SessionStatusEnum');
const Model = require('./Model');

class ClassCategoryParticipantSession extends Model {
    static get tableName() {
        return 'class_category_participant_session';
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
                builder.select('uuid', 'class_category_session_uuid');
            },
            sessionParticipants(builder) {
                builder.select('uuid', 'user_id', 'is_check_in');
            },
            unconfirmedSession(builder) {
                builder.select('uuid', 'class_category_session_uuid', 'is_check_in')
                    .withGraphFetched('classCategorySession(basicStartEnd)');
            },
            participants(builder) {
                builder.select('uuid', 'user_id', 'class_uuid', 'class_category_uuid', 'is_check_in')
                    .withGraphFetched('user(basic)')
                    .withGraphFetched('classRating(basicWithImprovements)')
                    .withGraphFetched('classReason(basic)');
            },
            withSession(builder) {
                builder.withGraphFetched('classCategorySession(single)')
            },
            complaint(builder) {
                builder.select('uuid', 'is_check_in', 'is_confirmed'); //Invoice aswell
            },
            mySessionsHistory(builder, classCategoryUuid, userId) {
                builder.select('class_category_participant_session.uuid', 'is_check_in', 'is_confirmed') //Invoice aswell
                    .withGraphFetched('classRating(basic)')
                    .withGraphFetched('classReason(basic)')
                    .withGraphJoined('classCategorySession(basicStartEnd)')
                    .where('class_category_uuid', classCategoryUuid)
                    .where('user_id', userId)
                    .where('classCategorySession.status', SessionStatusEnum.DONE);
            },
            categorySessionsHistory(builder, classCategoryUuid) {
                builder.select('class_category_participant_session.uuid', 'is_check_in', 'is_confirmed')
                    .withGraphFetched('classRating(basic)')
                    .withGraphFetched('classReason(basic)')
                    .withGraphFetched('user(basic)')
                    .withGraphJoined('classCategorySession(basicStartEnd)')
                    .where('class_category_uuid', classCategoryUuid)
                    .where('classCategorySession.status', SessionStatusEnum.DONE);
            },
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const ClassCategorySession = require('./ClassCategorySession');
        const User = require('../User');
        const ClassRatings = require('./ClassRatings');
        const ClassComplaints = require('./ClassComplaints');
        const ClassReasons = require('./ClassReasons');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category_participant_session.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_participant_session.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            classCategorySession: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategorySession,
                join: {
                    from: 'class_category_participant_session.class_category_session_uuid',
                    to: 'class_category_session.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_category_participant_session.user_id',
                    to: 'euser.euserid',
                }
            },
            classRating: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassRatings,
                join: {
                    from: 'class_category_participant_session.uuid',
                    to: 'class_ratings.class_category_participant_session_uuid',
                }
            },
            classComplaint: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassComplaints,
                join: {
                    from: 'class_category_participant_session.uuid',
                    to: 'class_complaints.class_category_participant_session_uuid',
                }
            },
            classReason: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassReasons,
                join: {
                    from: 'class_category_participant_session.uuid',
                    to: 'class_reasons.class_category_participant_session_uuid',
                }
            },
        }
    }
}

module.exports = ClassCategoryParticipantSession;