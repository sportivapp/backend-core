const ClassComplaintMedias = require('./ClassComplaintMedias');
const Model = require('./Model');

class ClassComplaints extends Model {
    static get tableName() {
        return 'class_complaints';
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
            coachListByStatus(builder, status) {
                builder.select('uuid', 'code', 'complaint', 'is_accepted')
                    .withGraphFetched('user(basic)')
                    .withGraphFetched('classCategorySession(basicStartEnd).[classCategory(uuidAndTitle)]')
                    .where('status', status);
            },
            myCategoryComplaints(builder) {
                builder.select('uuid', 'complaint', 'code', 'complaint_id', 'coach_reason')
                    .withGraphFetched('classCategoryParticipantSession(complaint)')
                    .withGraphFetched('classCategorySession(basicStartEnd).[classCategory(uuidAndTitle).[class(uuidAndTitle)]]')
                    .withGraphFetched('medias(list)');
            },
            coachComplaints(builder) {
                builder.select('uuid', 'complaint', 'code')
                    .where('coach_accepted', null)
                    .withGraphFetched('classCategoryParticipantSession(complaint)')
                    .withGraphFetched('classCategorySession(basicStartEnd).[classCategory(uuidAndTitle).[class(uuidAndTitle)]]')
                    .withGraphFetched('user(basic)');
            },
            fullComplaint(builder) {
                builder.select('uuid', 'complaint', 'code', 'coach_accept', 'coach_reason', 'complaint_id')
                    .withGraphFetched('classCategorySession(basicStartEnd)')
                    .withGraphFetched('class(uuidAndTitleWithPicture)')
                    .withGraphFetched('classCategory(uuidAndTitle)')
                    .withGraphFetched('user(basic)');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const ClassCategorySession = require('./ClassCategorySession');
        const ClassCategoryParticipantSession = require('./ClassCategoryParticipantSession');
        const User = require('../User');
        const ClassComplaintMedias = require('./ClassComplaintMedias');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_complaints.class_uuid',
                    to: 'class.uuid',
                },
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_complaints.class_category_uuid',
                    to: 'class_category.uuid',
                },
            },
            classCategorySession: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategorySession,
                join: {
                    from: 'class_complaints.class_category_session_uuid',
                    to: 'class_category_session.uuid',
                },
            },
            classCategoryParticipantSession: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategoryParticipantSession,
                join: {
                    from: 'class_complaints.class_category_participant_session_uuid',
                    to: 'class_category_participant_session.uuid',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_complaints.create_by',
                    to: 'euser.euserid',
                },
            },
            medias: {
                relation: Model.HasManyRelation,
                modelClass: ClassComplaintMedias,
                join: {
                    from: 'class_complaints.uuid',
                    to: 'class_complaint_medias.class_complaint_uuid',
                }
            }
        }
    }
}

module.exports = ClassComplaints;