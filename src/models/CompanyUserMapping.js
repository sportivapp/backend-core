const Model = require('./Model');

class CompanyUserMapping extends Model {
    static get tableName() {
        return 'ecompanyusermapping';
    };

    static get idColumn() {
        return 'ecompanyecompanyid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                ecompanyecompanyid: { type: 'integer' },
                eusereuserid: { type: 'integer' }
            }
        };
    }

    static get modifiers() {
        return {
            ...this.baseModifiers()
        }
    }
}

module.exports = CompanyUserMapping;