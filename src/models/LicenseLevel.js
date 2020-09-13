const Industry = require('./Industry');
const Model = require('./Model');

class LicenseLevel extends Model {
  static get tableName() {
    return 'elicenselevel';
  };

  static get idColumn() {
    return 'elicenselevelid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['elicenselevelid', 'elicenselevelname'],
      properties: {

      }
    };
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('elicenselevelid', 'elicenselevelname')
      },
      baseAttributesWithIndustry(builder) {
        builder.select('elicenselevelid', 'elicenselevelname')
        .withGraphFetched('industry(baseAttributes)')
      }
    }
  }

  static get relationMappings() {

    return {
      industry: {
        relation: Model.BelongsToOneRelation,
        modelClass: Industry,
        join: {
          from: 'elicenselevel.eindustryeindustryid',
          to: 'eindustry.eindustryid'
        }
      }
    }
  }

}

module.exports = LicenseLevel;