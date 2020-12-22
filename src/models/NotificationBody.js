const Model = require('./Model');

class NotificationBody extends Model {
    static get tableName() {
        return 'enotificationbody'
    }

    static get idColumn() {
        return 'enotificationbodyid'
    }

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
        const User = require('./User')

        return {
            notifications: {
                relation: Model.HasManyRelation,
                modelClass: Notification,
                join: {
                    from: 'enotificationbody.enotificationbodyid',
                    to: 'enotification.enotificationbodyenotificationbodyid'
                }
            },
            sender: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'enotificationbody.enotificationbodysenderid',
                    to: 'euser.euserid'
                }
            }
        }
    }

}

module.exports = NotificationBody;