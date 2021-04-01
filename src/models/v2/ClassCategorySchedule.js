const Model = require('./Model');

class ClassCategorySchedule extends Model {
    static get tableName() {
        return 'class_category_schedule';
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
            latest(builder) {
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'start_month', 'end_month', 
                'day', 'start_hour', 'start_minute', 'end_hour', 'end_minute')
                    .orderBy('create_time')
                    .first();
            },
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
 
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
        }
    }
}

module.exports = ClassCategorySchedule;