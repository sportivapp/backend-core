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
      }
    }
  }

  static get relationMappings() {

    return {
      
    }
  }

}

module.exports = LicenseLevel;