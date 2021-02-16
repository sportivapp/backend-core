const Model = require('./Model');

class ClassCategoryParticipant extends Model {
    static get tableName() {
        return 'class_category_participant';
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
            withCategory(builder) {
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'user_id')
                    .withGraphFetched('user(baseAttributes)')
                    .withGraphFetched('classCategory(list)');
            },            
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
                    from: 'class_category_participant.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join : {
                    from: 'class_category_participant.user_id',
                    to: 'euser.euserid',
                }
            }
        }
    }
}

module.exports = ClassCategoryParticipant;