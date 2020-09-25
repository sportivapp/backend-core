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

    static get modifiers() {

        return {
            // ...this.baseModifiers(),
            baseAttributes(builder) {
                builder.select('eindustryid', 'eindustryname')
            },
            baseAttributesWithLicenseLevels(builder) {
                builder.select('eindustryid', 'eindustryname')
                .withGraphFetched('licenseLevels(baseAttributes)')
            }
        }

    }

    static get relationMappings() {

        const Company = require('./Company')
        const LicenseLevel = require('./LicenseLevel')

        return {
            companies: {
                relation: Model.HasManyRelation,
                modelClass: Company,
                join: {
                    from: 'eindustry.eindustryid',
                    to: 'ecompany.eindustryeindustryid'
                }
            },
            licenseLevels: {
                relation: Model.HasManyRelation,
                modelClass: LicenseLevel,
                join: {
                    from: 'eindustry.eindustryid',
                    to: 'elicenselevel.eindustryeindustryid'
                }
            }
        }
    }

}

module.exports = Industry;