const Model = require('./Model');

class ClassCategoryPriceLog extends Model {
    static get tableName() {
        return 'class_category_price_log';
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
            list(builder) {
                builder.select('uuid', 'class_uuid', 'class_category_uuid', 'price', 'create_by', 'create_time')
                    .withGraphFetched('classCategory(list)')
                    .withGraphFetched('user(basic)')
            },
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
                    from: 'class_category_price_log.class_uuid',
                    to: 'class.uuid',
                }
            },
            classCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassCategory,
                join: {
                    from: 'class_category_price_log.class_category_uuid',
                    to: 'class_category.uuid',
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'class_category_price_log.create_by',
                    to: 'euser.euserid',
                }
            }
        }
    }
}

module.exports = ClassCategoryPriceLog;