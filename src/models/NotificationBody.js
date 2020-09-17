const Model = require('./Model');

class NotificationBody extends Model {
    static get tableName() {
        return 'enotificationbody'
    };

    static get idColumn() {
        return 'enotificationbodyid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
            }
        };
    }

    static get relationMappings() {

        const Notification = require('./Notification');

        return {
            notifications: {
                relation: Model.BelongsToOneRelation,
                modelClass: Notification,
                join: {
                    from: 'enotificationbody.enotificationbodyid',
                    to: 'enotification.enotificationbodyenotificationbodyid'
                }
            }
        }
    }

}

module.exports = NotificationBody;