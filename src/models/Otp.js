const Model = require('./Model');

class Otp extends Model {
    static get tableName() {
        return 'eotp';
    };

    static get idColumn() {
        return 'eotpid';
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

module.exports = Otp;