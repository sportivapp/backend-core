const Model = require('./Model');

class ClassReasons extends Model {
    static get tableName() {
        return 'class_reasons';
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
            single(builder) {
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'class_category_session_uuid', 'reason')
                    .withGraphFetched('user(basic)');
            },
            basic(builder) {
                builder.select('uuid', 'reason', 'create_time');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const ClassCategorySession = require('./ClassCategorySession');
        const User = require('../User');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_reasons.class_uuid',
                    to: 'class.uuid',
                },
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_reasons.class_category_uuid',
                    to: 'class_category.uuid',
                },
            },
            classCategorySession: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategorySession,
                join: {
                    from: 'class_reasons.class_category_session_uuid',
                    to: 'class_category_session.uuid',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_reasons.create_by',
                    to: 'euser.euserid',
                },
            },
        }
    }
}

module.exports = ClassReasons;