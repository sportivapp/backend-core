const Model = require('./Model');

class Industry extends Model {
    static get tableName() {
        return 'eindustry';
    };

    static get idColumn() {
        return 'eindustryid'
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

        const Company = require('./Company')

        return {
            companies: {
                relation: Model.HasManyRelation,
                modelClass: Company,
                join: {
                    from: 'eindustry.eindustryid',
                    to: 'ecompany.eindustryeindustryid'
                }
            }
        }
    }
}

module.exports = Industry;