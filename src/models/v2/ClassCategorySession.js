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
                builder.select('uuid', 'class_category_uuid', 'start_date', 'end_date')
                    .orderBy('start_date', 'ASC');
            }
        }
    }

    static get relationMappings() {

        const ClassCategory = require('./ClassCategory');
 
        return {
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_coach.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
        }
    }
}

module.exports = ClassCategorySession;