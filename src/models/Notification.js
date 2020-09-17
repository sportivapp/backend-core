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

}

module.exports = Notification;