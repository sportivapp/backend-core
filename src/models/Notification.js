const Model = require('./Model');

class Notification extends Model {
    static get tableName() {
        return 'enotification'
    };

    static get idColumn() {
        return 'enotificationid'
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
            status(builder) {
                builder.select('enotificationisread', 'enotificationisclicked');
            }
        }
    }

    static get relationMappings() {

        const NotificationBody = require('./NotificationBody');

        return {
            notificationBody: {
                relation: Model.BelongsToOneRelation,
                modelClass: NotificationBody,
                join: {
                    from: 'enotification.enotificationbodyenotificationbodyid',
                    to: 'enotificationbody.enotificationbodyid'
                }
            }
        }
    }

}

module.exports = Notification;