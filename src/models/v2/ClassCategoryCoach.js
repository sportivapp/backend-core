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
                builder.select('uuid', 'user_id', 'class_uuid', 'class_category_uuid')
                    .withGraphFetched('user(basic)');
            },
            basic(builder) {
                builder.select('uuid', 'user_id');
            },
        }
    }

    static get relationMappings() {

        const ClassCoach = require('./ClassCoach');
        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const User = require('../User');
 
        return {
            classCoach: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCoach,
                join: {
                    from: 'class_category_coach.class_coach_uuid',
                    to: 'class_coach.uuid',
                }
            },
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category_coach.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_coach.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_category_coach.user_id',
                    to: 'euser.euserid',
                }
            }
        }
    }
}

module.exports = ClassCategoryCoach;