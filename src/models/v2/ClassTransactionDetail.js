const Model = require('./Model');

class ClassTransactionDetail extends Model {
    static get tableName() {
        return 'class_transaction_detail';
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
                builder.select('uuid', 'class_session_start_date', 'class_session_end_date');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategory = require('./ClassCategory');
        const User = require('../User');
        const ClassTransaction = require('./ClassTransaction');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_transaction_detail.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_transaction_detail.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_transaction_detail.user_id',
                    to: 'euser.euserid',
                }
            },
            transaction: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassTransaction,
                join: {
                    from: 'class_transaction_detail.class_transaction_uuid',
                    to: 'class_transaction.uuid',
                }
            }
        }
    }
}

module.exports = ClassTransactionDetail;