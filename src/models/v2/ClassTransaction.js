const Model = require('./Model');

class ClassTransaction extends Model {
    static get tableName() {
        return 'class_transaction';
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
                
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const User = require('../User');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_transaction.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_transaction.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_transaction.user_id',
                    to: 'euser.euserid',
                }
            }
        }
    }
}

module.exports = ClassTransaction;