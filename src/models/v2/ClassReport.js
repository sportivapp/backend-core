const Model = require('./Model');

class ClassReport extends Model {
    static get tableName() {
        return 'class_report';
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
            // list(builder) {
            //     builder.select('uuid', 'title', 'price')
            //         .modify('notDeleted');
            // }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category.class_uuid',
                    to: 'class.uuid',
                }
            },
        }
    }
}

module.exports = ClassReport;