const Model = require('./Model');

class ClassCoach extends Model {
    static get tableName() {
        return 'class_coach';
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
                builder.select('uuid', 'user_id', 'class_uuid');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const User = require('../User');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCoach: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_coach.user_id',
                    to: 'euser.euserid',
                }
            }
        }
    }
}

module.exports = ClassCoach;