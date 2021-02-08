const Model = require('./Model');

class ClassCategoryCoach extends Model {
    static get tableName() {
        return 'class_category_coach';
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
                builder.select('uuid', 'user_id', 'class_category_uuid');
            }
        }
    }

    static get relationMappings() {

        const ClassCategory = require('./ClassCategory');
        const User = require('../User');
 
        return {
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_coach.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            coach: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class__category_coach.user_id',
                    to: 'euser.euserid',
                }
            }
        }
    }
}

module.exports = ClassCategoryCoach;