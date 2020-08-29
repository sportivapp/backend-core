const Model = require('./Model');

class Otp extends Model {
    static get tableName() {
        return 'otp';
    };

    static get idColumn() {
        return 'otpid';
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