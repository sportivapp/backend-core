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
            baseAttributes(builder) {
                builder.select('id', 'title', 'description', 'administration_fee', 'price', 'requirements');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class')
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category.class_uuid',
                    to: 'class.uuid'
                }
            },
        }
    }
}

module.exports = ClassCategory;