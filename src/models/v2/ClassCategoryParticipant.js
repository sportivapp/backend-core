const Model = require('./Model');

class ClassCategoryParticipant extends Model {
    static get tableName() {
        return 'class_category_participant';
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
            withCategory(builder) {
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'user_id')
                    .withGraphFetched('user(basic)')
                    .withGraphFetched('classCategory(list)');
            },
            register(builder) {
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'user_id')
                    .withGraphFetched('class(register)')
                    .withGraphFetched('classCategory(uuidAndTitle)')
                    .withGraphFetched('user(basic)');
            },
            participant(builder) {
                builder.select('uuid', 'user_id', 'class_uuid', 'class_category_uuid', 'month_utc', 'start')
                    .withGraphFetched('user(basic)');
            },
            participantCheckIn(builder) {
                builder.select('class_category_participant.uuid', 'user_id', 'class_uuid', 'class_category_uuid', 'month_utc', 'start', 'cps.is_check_in')
                    .leftJoinRelated('categoryParticipantSession as cps')
                    .withGraphFetched('user(basic)');
            },
            basic(builder) {
                builder.select('uuid', 'user_id', 'class_uuid', 'class_category_uuid', 'month_utc', 'start')
            },
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const User = require('../User');
        const ClassCategoryParticipantSession = require('./ClassCategoryParticipantSession');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category_participant.class_uuid',
                    to: 'class.uuid'
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_participant.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join : {
                    from: 'class_category_participant.user_id',
                    to: 'euser.euserid',
                }
            },
            categoryParticipantSession: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategoryParticipantSession,
                join: {
                    from: 'class_category_participant.uuid',
                    to: 'class_category_participant_session.class_category_participant_uuid',
                }
            }
        }
    }
}

module.exports = ClassCategoryParticipant;