const Model = require('./Model');

class ClassRatings extends Model {
    static get tableName() {
        return 'class_ratings';
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
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'class_category_session_uuid', 'rating', 'review')
                    .withGraphFetched('user(basic)');
            },
            basic(builder) {
                builder.select('uuid', 'rating', 'review', 'create_time');
            },
            basicWithImprovements(builder) {
                builder.select('uuid', 'rating', 'review', 'create_time')
                    .withGraphFetched('improvements(baseAttributes)');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const ClassCategorySession = require('./ClassCategorySession');
        const User = require('../User');
        const ClassRatingImprovements = require('./ClassRatingImprovements');
 
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
            improvements: {
                relation: Model.HasManyRelation,
                modelClass: ClassRatingImprovements,
                join: {
                    from: 'class_ratings.uuid',
                    to: 'class_rating_improvements.class_rating_uuid',
                },
            }
        }
    }
}

module.exports = ClassRatings;