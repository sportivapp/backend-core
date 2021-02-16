const ClassCategoryParticipant = require('./ClassCategoryParticipant');
const Model = require('./Model');

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
                builder.select('uuid', 'title', 'description', 'price', 'requirements')
                    .withGraphFetched('categorySessions(listThisMonth)')
                    .withGraphFetched('coaches(baseAttributes)')
                    .withGraphFetched('participants(baseAttributes)');
            },
            price(builder) {
                builder.select('price');
            },
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategorySession = require('./ClassCategorySession');
        const ClassCategoryCoach = require('./ClassCategoryCoach');
 
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
                relation: Model.BelongsToOneRelation,
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
            }
        }
    }
}

module.exports = ClassCategory;