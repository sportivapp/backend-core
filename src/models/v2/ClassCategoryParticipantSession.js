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
                builder.select('uuid', 'class_category_participant_uuid', 'class_category_session_uuid');
            },
            sessionParticipants(builder) {
                builder.select('uuid', 'is_check_in')
                    .withGraphFetched('classCategoryParticipant(participant)');
            },
        }
    }

    static get relationMappings() {

        const ClassCategoryParticipant = require('./ClassCategoryParticipant');
        const ClassCategorySession = require('./ClassCategorySession');
 
        return {
            classCategoryParticipant: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategoryParticipant,
                join: {
                    from: 'class_category_participant_session.class_category_participant_uuid',
                    to: 'class_category_participant.uuid'
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
        }
    }
}

module.exports = ClassCategoryParticipantSession;