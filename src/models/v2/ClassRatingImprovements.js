const Model = require('./Model');

class ClassRatingImprovements extends Model {
    static get tableName() {
        return 'class_rating_improvements';
    };

    static get idColumn() {
        return 'id'
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
                builder.select('uuid', 'class_rating_uuid', 'code');
            }
        }
    }

    static get relationMappings() {

        const ClassRatings = require('./ClassRatings');
 
        return {
            classRating: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassRatings,
                join: {
                    from: 'class_rating_improvements.class_rating_uuid',
                    to: 'class_rating.uuid',
                },
            },
        }
    }
}

module.exports = ClassRatingImprovements;