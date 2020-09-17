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

}

module.exports = NotificationBody;