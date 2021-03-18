const Model = require('./Model');

class ClassComplaints extends Model {
    static get tableName() {
        return 'class_complaints';
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
            coachListByStatus(builder, status) {
                builder.select('uuid', 'code', 'complaint', 'is_accepted')
                    .withGraphFetched('user(basic)')
                    .withGraphFetched('classCategorySession(basicStartEnd).[classCategory(uuidAndTitle)]')
                    .where('status', status);
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
                    from: 'class_ratings.class_uuid',
                    to: 'class.uuid',
                },
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_ratings.class_category_uuid',
                    to: 'class_category.uuid',
                },
            },
            classCategorySession: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategorySession,
                join: {
                    from: 'class_ratings.class_category_session_uuid',
                    to: 'class_category_session.uuid',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_ratings.create_by',
                    to: 'euser.euserid',
                },
            },
        }
    }
}

module.exports = ClassComplaints;