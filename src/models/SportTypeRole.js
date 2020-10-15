const Model = require('./Model');

class SportTypeRole extends Model {
    static get tableName() {
        return 'esporttyperole';
    };

    static get idColumn() {
        return 'esporttyperoleid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['esporttyperolename', 'eindustryeindustryid'],
            properties: {
                esporttyperolename: { type: 'string',   minLength: 1, maxLength: 128 },
                eindustryeindustryid: { type: 'integer' }
            }
        };
    }

    static get modifiers () {
        return {
            baseAttributes(builder) {
              builder.select('esporttyperoleid', 'esporttyperolename')
            },
        }
    }

    static get relationMappings() {
    }
}

module.exports = SportTypeRole;