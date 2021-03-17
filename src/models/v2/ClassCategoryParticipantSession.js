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
                builder.select('uuid', 'class_category_session_uuid')
                    .withGraphFetched('classCategorySession(basicStartEnd)');
            },
            participants(builder) {
                builder.select('uuid', 'user_id', 'class_uuid', 'class_category_uuid', 'is_check_in')
                    .withGraphFetched('user(basic)');
            }
        }
    }

    static get relationMappings() {

        const ClassCategorySession = require('./ClassCategorySession');
        const User = require('../User');
 
        return {
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
            }
        }
    }
}

module.exports = ClassCategoryParticipantSession;