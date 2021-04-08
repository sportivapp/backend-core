const Model = require('./Model');
const sessionStatusEnum = require('../enum/SessionStatusEnum');

class ClassCategory extends Model {
    static get tableName() {
        return 'class_category';
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
                builder.select('uuid', 'title', 'price')
                    .modify('notDeleted');
            },
            adminDetail(builder) {
                builder.select('uuid', 'title', 'description', 'price', 'requirements', 'is_recurring')
                    .modify('notDeleted')
                    .withGraphFetched('categorySessions(list)')
                    .withGraphFetched('coaches(baseAttributes)');
            },
            userDetail(builder) {
                builder.select('class_category.uuid', 'class_category.title', 'description', 'price', 'requirements', 'is_recurring')
                    .modify('notDeleted')
                    .withGraphFetched('coaches(baseAttributes)')
                    .withGraphFetched('categorySessions(list)')
            },
            price(builder) {
                builder.select('price');
            },
            uuidAndTitle(builder) {
                builder.select('uuid', 'title');
            },
            myCategory(builder, userId, sessionUuids) {
                builder.select('uuid', 'title')
                    .withGraphFetched('class(basic)')
                    .withGraphFetched('categorySessions(list)')
                    .modifyGraph('categorySessions', builder => {
                        builder.whereIn('uuid', sessionUuids);
                    })
                    .withGraphFetched('transactions(invoice)')
                    .modifyGraph('transactions', builder => {
                        builder.where('user_id', userId);
                    });
            },
            coachCategory(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('class(basic)')
                    .withGraphFetched('categorySessions(list) as ongoingSessions')
                    .modifyGraph('ongoingSessions', builder => {
                        builder.where('start_date', '>=', Date.now())
                            .where('status', sessionStatusEnum.ONGOING)
                            .orderBy('start_date', 'ASC');
                    })
                    .withGraphFetched('categorySessions(list) as upcomingSessions')
                    .modifyGraph('upcomingSessions', builder => {
                        builder.where('start_date', '>=', Date.now())
                            .where('status', sessionStatusEnum.UPCOMING)
                            .orderBy('start_date', 'ASC');
                    });
            },
            titleWithRating(builder) {
                // TODO: Add rating later
                builder.select('uuid', 'title');
            },
            book(builder) {
                builder.select('uuid', 'title', 'price', 'is_recurring')
                    .withGraphFetched('class(administrationFee)')
            },
            notDeleted(builder) {
                builder.whereRaw('delete_time IS NULL');
            },
            categoryDetailWithInvoices(builder, userId) {
                builder.select('uuid', 'title')
                    .withGraphFetched('class(basic)')
                    .withGraphFetched('transactions(invoice)')
                    .modifyGraph('transactions', builder => {
                        builder.where('user_id', userId);
                    });
            },
            categoryDetailWithoutInvoices(builder) {
                builder.select('uuid', 'title')
                    .withGraphFetched('class(basic)')
            },
            classCity(builder) {
                builder.withGraphFetched('class(uuidAndTitle).[city(baseAttributes)]')
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const ClassCategorySession = require('./ClassCategorySession');
        const ClassCategoryCoach = require('./ClassCategoryCoach');
        const ClassCategorySchedule = require('./ClassCategorySchedule');
        const ClassTransaction = require('./ClassTransaction');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_category.class_uuid',
                    to: 'class.uuid',
                }
            },
            categorySessions: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategorySession,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_session.class_category_uuid',
                }
            },
            coaches: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategoryCoach,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_coach.class_category_uuid',
                }
            },
            schedules: {
                relation: Model.HasManyRelation,
                modelClass: ClassCategorySchedule,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_category_schedule.class_category_uuid',
                }
            },
            transactions: {
                relation: Model.HasManyRelation,
                modelClass: ClassTransaction,
                join: {
                    from: 'class_category.uuid',
                    to: 'class_transaction.class_category_uuid',
                }
            }
        }
    }
}

module.exports = ClassCategory;